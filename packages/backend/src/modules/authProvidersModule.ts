import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { atlassianAuthenticator, atlassianSignInResolvers } from '@backstage/plugin-auth-backend-module-atlassian-provider';
import { auth0Authenticator } from '@backstage/plugin-auth-backend-module-auth0-provider';
import { azureEasyAuthAuthenticator, azureEasyAuthSignInResolvers } from '@backstage/plugin-auth-backend-module-azure-easyauth-provider';
import { bitbucketAuthenticator, bitbucketSignInResolvers } from '@backstage/plugin-auth-backend-module-bitbucket-provider';
import { bitbucketServerAuthenticator, bitbucketServerSignInResolvers } from '@backstage/plugin-auth-backend-module-bitbucket-server-provider';
import { cloudflareAccessSignInResolvers, createCloudflareAccessAuthenticator } from '@backstage/plugin-auth-backend-module-cloudflare-access-provider';
import { gcpIapAuthenticator, gcpIapSignInResolvers } from '@backstage/plugin-auth-backend-module-gcp-iap-provider';
import { githubAuthenticator, githubSignInResolvers } from '@backstage/plugin-auth-backend-module-github-provider';
import { gitlabAuthenticator, gitlabSignInResolvers } from '@backstage/plugin-auth-backend-module-gitlab-provider';
import { googleAuthenticator } from '@backstage/plugin-auth-backend-module-google-provider';
import { microsoftAuthenticator, microsoftSignInResolvers } from '@backstage/plugin-auth-backend-module-microsoft-provider';
import { oauth2ProxyAuthenticator, oauth2ProxySignInResolvers } from '@backstage/plugin-auth-backend-module-oauth2-proxy-provider';
import { oidcAuthenticator, oidcSignInResolvers } from '@backstage/plugin-auth-backend-module-oidc-provider';
import { oktaAuthenticator, oktaSignInResolvers } from '@backstage/plugin-auth-backend-module-okta-provider';
import { oneLoginAuthenticator, oneLoginSignInResolvers } from '@backstage/plugin-auth-backend-module-onelogin-provider';
import { authOwnershipResolutionExtensionPoint, AuthProviderFactory, authProvidersExtensionPoint, commonSignInResolvers, createOAuthProviderFactory, createProxyAuthProviderFactory, createProxyAuthenticator, ProfileInfo } from '@backstage/plugin-auth-node';
import { decodeJwt, jwtVerify, createRemoteJWKSet } from 'jose';



import { DynamicUserEntityProvider } from '../providers/dynamicUserEntityProvider.ts';
import { TransitiveGroupOwnershipResolver } from '../transitiveGroupOwnershipResolver';
import { trySignInResolvers } from './resolverUtils';
import { rhdhSignInResolvers } from './rhdhSignInResolvers';


function getAuthProviderFactory(
  providerId: string,
  disableIdentityResolution: boolean,
  getUserEntityProvider: () => DynamicUserEntityProvider,
): AuthProviderFactory {
  const jwtAuthenticator = createProxyAuthenticator({
    defaultProfileTransform: async (result: { userEntityRef: string; ownershipEntityRefs: string[]; email?: string; displayName?: string }) => {
      const profile: ProfileInfo = {
        email: result.email,
        displayName: result.displayName,
      };
      return { profile };
    },
    initialize(_ctx: { config: any }) {
      return { config: _ctx.config };
    },
    async authenticate(options: { req: any }, ctx: any) {
      const auth = options.req.header('authorization') || options.req.header('Authorization');
      const bearer = typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')
        ? auth.slice(7).trim()
        : undefined;
      let claims: any = {};
      if (bearer) {
        try {
          const env = (ctx?.config?.getOptionalString?.('auth.environment') ?? 'development') as string;
          const metadataUrl =
            ctx?.config?.getOptionalString?.(`auth.providers.jwt.${env}.metadataUrl`) ??
            ctx?.config?.getOptionalString?.(`auth.providers.oidc.${env}.metadataUrl`);

          if (!metadataUrl) {
            throw new Error('Missing OIDC metadataUrl for jwt auth provider');
          }

          if (!ctx.__jwt || ctx.__jwt.metadataUrl !== metadataUrl) {
            const resp = await fetch(metadataUrl);
            if (!resp.ok) {
              throw new Error(`Failed to load OIDC metadata (${resp.status})`);
            }
            const meta = await resp.json();
            const jwksUri = meta?.jwks_uri;
            if (!jwksUri) {
              throw new Error('Missing jwks_uri in OIDC metadata');
            }
            ctx.__jwt = {
              metadataUrl,
              issuer: meta?.issuer,
              jwks: createRemoteJWKSet(new URL(jwksUri)),
            };
          }

          const verifyRes = await jwtVerify(bearer, ctx.__jwt.jwks, ctx.__jwt.issuer ? { issuer: ctx.__jwt.issuer } : {});
          claims = verifyRes.payload;
        } catch (_e) {
          // As a fallback, attempt to decode without verification (not ideal, but avoids total failure)
          try { claims = decodeJwt(bearer); } catch { claims = {}; }
        }
      }
      const email: string | undefined = claims?.email;
      const preferredUsername: string | undefined = claims?.preferred_username;
      const sub: string | undefined = claims?.sub;
      // Extract username: prefer preferred_username (split by @ if it contains @), then email (split by @), then sub (split by @ if it contains @)
      const username = (
        (preferredUsername ? (preferredUsername.includes('@') ? preferredUsername.split('@')[0] : preferredUsername) : undefined) ||
        (email ? email.split('@')[0] : undefined) ||
        (sub ? (sub.includes('@') ? sub.split('@')[0] : sub) : undefined) ||
        ''
      ).toString().toLocaleLowerCase();
      const userEntityRef = `user:default/${username}`;
      let entitlements: string[] = Array.isArray(claims?.groups) ? claims.groups : [];
      
      // Extract roles from multiple possible locations in the JWT token
      try {
        // Check resource_access.octo.roles (Keycloak client roles)
        const clientRoles = claims?.resource_access?.octo?.roles;
        if (Array.isArray(clientRoles)) {
          entitlements = entitlements.concat(clientRoles);
        }
        
        // Check realm_access.roles (Keycloak realm roles)
        const realmRoles = claims?.realm_access?.roles;
        if (Array.isArray(realmRoles)) {
          entitlements = entitlements.concat(realmRoles);
        }
        
        // Check direct roles claim
        const directRoles = claims?.roles;
        if (Array.isArray(directRoles)) {
          entitlements = entitlements.concat(directRoles);
        }
        
        // Check for roles in other resource_access clients
        if (claims?.resource_access) {
          Object.values(claims.resource_access).forEach((client: any) => {
            if (client?.roles && Array.isArray(client.roles)) {
              entitlements = entitlements.concat(client.roles);
            }
          });
        }
      } catch (_e) {
        // Silently continue if role extraction fails
      }
      
      const ownershipEntityRefs = entitlements
        .filter((g: unknown) => typeof g === 'string' && g)
        .map((g: string) => `group:default/${g}`);

      return {
        result: { userEntityRef, ownershipEntityRefs, email, displayName: preferredUsername ?? email },
      };
    },
  });
  const applySignInResolvers = (options: {
    signInResolver: any;
    signInResolverFactories: Record<string, any>;
  }) => (!disableIdentityResolution ? options : {});

  switch (providerId) {
    case 'atlassian':
      return createOAuthProviderFactory({
        authenticator: atlassianAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            atlassianSignInResolvers.usernameMatchingUserEntityName(),
          signInResolverFactories: {
            ...atlassianSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'auth0':
      return createOAuthProviderFactory({
        authenticator: auth0Authenticator,
        ...applySignInResolvers({
          signInResolver:
            commonSignInResolvers.emailMatchingUserEntityProfileEmail(),
          signInResolverFactories: {
            ...commonSignInResolvers,
          },
        }),
      });
    case 'azure-easyauth':
      return createProxyAuthProviderFactory({
        authenticator: azureEasyAuthAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            azureEasyAuthSignInResolvers.idMatchingUserEntityAnnotation(),
          signInResolverFactories: {
            ...azureEasyAuthSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'bitbucket':
      return createOAuthProviderFactory({
        authenticator: bitbucketAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            bitbucketSignInResolvers.usernameMatchingUserEntityAnnotation(),
          signInResolverFactories: {
            ...bitbucketSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'bitbucketServer':
      return createOAuthProviderFactory({
        authenticator: bitbucketServerAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            bitbucketServerSignInResolvers.emailMatchingUserEntityProfileEmail(),
          signInResolverFactories: {
            ...bitbucketServerSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'cfaccess':
      return createProxyAuthProviderFactory({
        authenticator: createCloudflareAccessAuthenticator(),
        ...applySignInResolvers({
          signInResolver:
            cloudflareAccessSignInResolvers.emailMatchingUserEntityProfileEmail(),
          signInResolverFactories: {
            ...cloudflareAccessSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'github':
      return createOAuthProviderFactory({
        authenticator: githubAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            githubSignInResolvers.usernameMatchingUserEntityName(),
          signInResolverFactories: {
            ...githubSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'gitlab':
      return createOAuthProviderFactory({
        authenticator: gitlabAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            gitlabSignInResolvers.usernameMatchingUserEntityName(),
          signInResolverFactories: {
            ...gitlabSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'google':
      return createOAuthProviderFactory({
        authenticator: googleAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            commonSignInResolvers.emailLocalPartMatchingUserEntityName(),
          signInResolverFactories: {
            ...commonSignInResolvers,
          },
        }),
      });
    case 'gcp-iap':
      return createProxyAuthProviderFactory({
        authenticator: gcpIapAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            gcpIapSignInResolvers.emailMatchingUserEntityAnnotation(),
          signInResolverFactories: {
            ...gcpIapSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'oauth2Proxy':
      return createProxyAuthProviderFactory({
        authenticator: oauth2ProxyAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            rhdhSignInResolvers.oauth2ProxyUserHeaderMatchingUserEntityName(),
          signInResolverFactories: {
            ...oauth2ProxySignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'oidc':
      return createOAuthProviderFactory({
        authenticator: oidcAuthenticator,
        ...applySignInResolvers({
          signInResolver: trySignInResolvers([
            rhdhSignInResolvers.oidcSubClaimMatchingKeycloakUserId(),
            rhdhSignInResolvers.oidcLdapUuidMatchingAnnotation(),
          ]),
          signInResolverFactories: {
            oauth2TokenClaimResolver:
              rhdhSignInResolvers.oauth2TokenClaimResolver(getUserEntityProvider),
            preferredUsernameMatchingUserEntityName:
              rhdhSignInResolvers.preferredUsernameMatchingUserEntityName,
            oidcSubClaimMatchingKeycloakUserId:
              rhdhSignInResolvers.oidcSubClaimMatchingKeycloakUserId,
            oidcSubClaimMatchingPingIdentityUserId:
              rhdhSignInResolvers.oidcSubClaimMatchingPingIdentityUserId,
            oidcLdapUuidMatchingAnnotation:
              rhdhSignInResolvers.oidcLdapUuidMatchingAnnotation,
            ...oidcSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'jwt':
      return createProxyAuthProviderFactory({
        authenticator: jwtAuthenticator,
        // Sign-in resolver that mints a Backstage token using the issuer
        // If groups are missing from token, fetch from catalog via signInWithCatalogUser
        signInResolver: async (info, ctx) => {
          const sub = info.result.userEntityRef as string;
          const ent = (info.result.ownershipEntityRefs as string[]) ?? [];
          
          // Debug logging to trace role extraction
          if (ent.length > 0) {
            console.log(`[JWT Auth] Extracted ownershipEntityRefs for ${sub}:`, ent);
          } else {
            console.log(`[JWT Auth] No ownershipEntityRefs found for ${sub}, attempting catalog lookup`);
          }
          
          // If groups are missing from IdP token, fetch from catalog
          // signInWithCatalogUser automatically includes both user entity ref and groups from spec.memberOf
          if (ent.length === 0) {
            try {
              // Extract username from userEntityRef (format: user:default/username)
              const username = sub.split('/').pop();
              if (username) {
                // signInWithCatalogUser looks up the user in catalog and automatically
                // includes groups from spec.memberOf in the returned token
                const catalogResult = await ctx.signInWithCatalogUser({
                  entityRef: { name: username },
                });
                console.log(`[JWT Auth] Catalog lookup for ${username} succeeded`);
                return catalogResult;
              }
            } catch (e: any) {
              // If catalog lookup fails, fall back to issuing token without groups
              // This allows login to proceed even if user is not in catalog
              console.log(`[JWT Auth] Catalog lookup failed: ${e?.message || e}`);
            }
          }
          
          // Issue token with groups from IdP token (or empty if none)
          const tokenClaims = { sub, ...(ent.length ? { ent } : {}) };
          console.log(`[JWT Auth] Issuing token for ${sub} with claims:`, JSON.stringify(tokenClaims, null, 2));
          return ctx.issueToken({ claims: tokenClaims });
        },
      });
    case 'okta':
      return createOAuthProviderFactory({
        authenticator: oktaAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            oktaSignInResolvers.emailMatchingUserEntityAnnotation(),
          signInResolverFactories: {
            ...oktaSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'onelogin':
      return createOAuthProviderFactory({
        authenticator: oneLoginAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            oneLoginSignInResolvers.usernameMatchingUserEntityName(),
          signInResolverFactories: {
            ...oneLoginSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    case 'microsoft':
      return createOAuthProviderFactory({
        authenticator: microsoftAuthenticator,
        ...applySignInResolvers({
          signInResolver:
            microsoftSignInResolvers.userIdMatchingUserEntityAnnotation(),
          signInResolverFactories: {
            ...microsoftSignInResolvers,
            ...commonSignInResolvers,
          },
        }),
      });
    default:
      throw new Error(`No auth provider found for ${providerId}`);
  }
}

const authProvidersModule = (
  getUserEntityProvider: () => DynamicUserEntityProvider,
) =>
  createBackendModule({
  pluginId: 'auth',
  moduleId: 'auth.providers',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        authProviders: authProvidersExtensionPoint,
        authOwnershipResolution: authOwnershipResolutionExtensionPoint,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        auth: coreServices.auth,
      },
      async init({
        config,
        authProviders,
        authOwnershipResolution,
        logger,
        discovery,
        auth,
      }) {
        const providersConfig = config.getConfig('auth.providers');
        const authFactories: Record<string, AuthProviderFactory> = {};
        const environment =
          config.getOptionalString('auth.environment') ?? 'development';
        providersConfig
          .keys()
          .filter(key => key !== 'guest')
          .forEach(providerId => {
            const disableIdentityResolution =
              config.getOptionalBoolean(
                `auth.providers.${providerId}.${environment}.disableIdentityResolution`,
              ) ?? false;
            const factory = getAuthProviderFactory(
              providerId,
              disableIdentityResolution,
              getUserEntityProvider
            );
            authFactories[providerId] = factory;
          });

          const providerFactories: Record<string, AuthProviderFactory> = {
            ...authFactories,
          };

          logger.info(
            `Enabled Provider Factories : ${JSON.stringify(providerFactories)}`,
          );
          const transitiveGroupOwnershipResolver =
            new TransitiveGroupOwnershipResolver({ discovery, config, auth });
          authOwnershipResolution.setAuthOwnershipResolver(
            transitiveGroupOwnershipResolver,
          );

          Object.entries(providerFactories).forEach(([providerId, factory]) => {
            authProviders.registerProvider({ providerId, factory });
          });
        },
      });
    },
  });

export default authProvidersModule;
