import {
  DEFAULT_NAMESPACE,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import type { OAuth2ProxyResult } from '@backstage/plugin-auth-backend-module-oauth2-proxy-provider';
import type { OidcAuthResult } from '@backstage/plugin-auth-backend-module-oidc-provider';
import {
  AuthResolverContext,
  BackstageSignInResult,
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  SignInInfo,
} from '@backstage/plugin-auth-node';

import { decodeJwt } from 'jose';
import { z } from 'zod';

import { DynamicUserEntityProvider } from '../providers/dynamicUserEntityProvider.ts';
import { createOidcSubClaimResolver, OidcProviderInfo } from './resolverUtils';

const KEYCLOAK_INFO: OidcProviderInfo = {
  userIdKey: 'keycloak.org/id',
  providerName: 'Keycloak',
};

const PING_IDENTITY_INFO: OidcProviderInfo = {
  userIdKey: 'pingidentity.org/id',
  providerName: 'Ping Identity',
};

const LDAP_UUID_ANNOTATION = 'backstage.io/ldap-uuid';

/**
 * Additional RHDH specific sign-in resolvers.
 *
 * @public
 */
export namespace rhdhSignInResolvers {
  /**
   * A oidc resolver that looks up the user using their preferred username
   * as the entity name
   */
  export const preferredUsernameMatchingUserEntityName =
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options) {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<OidcAuthResult>>,
          ctx,
        ) => {
          const userId = info.result.fullProfile.userinfo.preferred_username;
          if (!userId) {
            throw new Error(`OIDC user profile does not contain a username`);
          }

          return ctx.signInWithCatalogUser(
            {
              entityRef: { name: userId },
            },
            {
              dangerousEntityRefFallback:
                options?.dangerouslyAllowSignInWithoutUserInCatalog
                  ? { entityRef: userId }
                  : undefined,
            },
          );
        };
      },
    });

  /**
   * An OIDC resolver that looks up the user using their Keycloak user ID.
   */
  export const oidcSubClaimMatchingKeycloakUserId =
    createOidcSubClaimResolver(KEYCLOAK_INFO);

  /**
   * An OIDC resolver that looks up the user using their Ping Identity user ID.
   */
  export const oidcSubClaimMatchingPingIdentityUserId =
    createOidcSubClaimResolver(PING_IDENTITY_INFO);

  /**
   * An oauth2proxy resolver that looks up the user using the OAUTH_USER_HEADER environment variable,
   * 'x-forwarded-preferred-username' or 'x-forwarded-user'.
   */
  export const oauth2ProxyUserHeaderMatchingUserEntityName =
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create(options) {
        return async (
          info: SignInInfo<OAuth2ProxyResult>,
          ctx: AuthResolverContext,
        ) => {
          const name = process.env.OAUTH_USER_HEADER
            ? info.result.getHeader(process.env.OAUTH_USER_HEADER)
            : info.result.getHeader('x-forwarded-preferred-username') ||
              info.result.getHeader('x-forwarded-user');
          if (!name) {
            throw new Error('Request did not contain a user');
          }
          return ctx.signInWithCatalogUser(
            {
              entityRef: { name },
            },
            {
              dangerousEntityRefFallback:
                options?.dangerouslyAllowSignInWithoutUserInCatalog
                  ? { entityRef: name }
                  : undefined,
            },
          );
        };
      },
    });

  export const oidcLdapUuidMatchingAnnotation = createSignInResolverFactory({
    optionsSchema: z
      .object({
        dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        ldapUuidKey: z.string().optional(),
      })
      .optional(),
    create(options) {
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<OidcAuthResult>>,
        ctx: AuthResolverContext,
      ) => {
        const uuidKey = options?.ldapUuidKey ?? 'ldap_uuid';
        const uuid = info.result.fullProfile.userinfo[uuidKey] as string;
        if (!uuid) {
          throw new Error(
            `The user profile from LDAP is missing the UUID, likely due to a misconfiguration in the provider. Please contact your system administrator for assistance.`,
          );
        }

        const idToken = info.result.fullProfile.tokenset.id_token;
        if (!idToken) {
          throw new Error(
            `The user ID token from LDAP is missing. Please contact your system administrator for assistance.`,
          );
        }

        const uuidFromIdToken = decodeJwt(idToken)?.[uuidKey];
        if (uuid !== uuidFromIdToken) {
          throw new Error(
            `There was a problem verifying your identity with LDAP due to mismatching UUID. Please contact your system administrator for assistance.`,
          );
        }

        return ctx.signInWithCatalogUser(
          {
            annotations: { [LDAP_UUID_ANNOTATION]: uuid },
          },
          {
            dangerousEntityRefFallback:
              options?.dangerouslyAllowSignInWithoutUserInCatalog
                ? { entityRef: uuid }
                : undefined,
          },
        );
      };
    },
  });

  export const oauth2TokenClaimResolver = (
    getUserEntityProvider: () => DynamicUserEntityProvider,
  ) =>
    createSignInResolverFactory({
      optionsSchema: z
        .object({
          dangerouslyAllowSignInWithoutUserInCatalog: z.boolean().optional(),
        })
        .optional(),
      create() {
        return async (
          info: SignInInfo<OAuthAuthenticatorResult<OidcAuthResult>>,
          ctx: AuthResolverContext,
        ) => {
          const tokens =
            info.result.fullProfile?.tokenset.access_token?.split('.');
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const claims = JSON.parse(atob(tokens[1]));
          if (!info.profile.email) {
            throw new Error(
              'Login failed, user profile does not contain an email',
            );
          }

          const [username] = info.profile.email.split('@');
          let entitlements: string[] = (claims?.groups as string[]) ?? [];
          entitlements = entitlements.concat(
            claims?.resource_access?.octo?.roles ?? [],
          );
          const groups = entitlements?.map(
            (entitlement: string) => `group:default/${entitlement}`,
          );

          const userEntity: Entity = {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'User',
            metadata: {
              name: username,
              namespace: DEFAULT_NAMESPACE,
              annotations: {
                'backstage.io/managed-by-location': `url:dynamic-user-provider`,
                'backstage.io/managed-by-origin-location': `url:dynamic-user-provider`,
              },
            },
            spec: {
              profile: {
                displayName: username,
                email: info.profile.email,
              },
              memberOf: groups,
            },
          };
          const userEntityRef = stringifyEntityRef(userEntity);
          try {
            await getUserEntityProvider().addOrUpdateUser(userEntity);
          } catch (error) {
            console.error('Failed to add user to catalog via provider:', error);
          }

          let result: BackstageSignInResult | undefined;
          let attempt = 0;
          const MAX_RETRIES = 10;
          const RETRY_DELAY_MS = 300;

          while (attempt < MAX_RETRIES) {
            try {
              result = await ctx.signInWithCatalogUser({
                entityRef: userEntityRef,
              });
              break;
            } catch (err: unknown) {
              if (
                typeof err === 'object' &&
                err !== null &&
                'name' in err &&
                'message' in err
              ) {
                const typedErr = err as { name: string; message: string };
                if (typedErr.name === 'NotFoundError') {
                  await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
                  attempt++;
                  continue;
                }

                throw new Error(
                  `Failed to sign in with catalog user: ${typedErr.message}`,
                );
              }
            }
          }

          if (!result) {
            throw new Error(
              `User entity ${userEntityRef} not found in catalog after ${MAX_RETRIES} attempts`,
            );
          }

          return result;
        };
      },
    });
}
