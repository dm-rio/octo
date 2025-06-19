import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

import { DynamicUserEntityProvider } from '../providers/dynamicUserEntityProvider';

let dynamicUserEntityProvider: DynamicUserEntityProvider | undefined;

const dynamicUsersModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'dynamic-user-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ catalog, logger }) {
        dynamicUserEntityProvider = new DynamicUserEntityProvider(logger);
        catalog.addEntityProvider(dynamicUserEntityProvider);
      },
    });
  },
});

export default dynamicUsersModule;
export function getDynamicUserEntityProvider(): DynamicUserEntityProvider {
  if (!dynamicUserEntityProvider) {
    throw new Error(
      'DynamicUserEntityProvider has not been initialized yet. Ensure the dynamicUsersModule has been registered and initialized.',
    );
  }
  return dynamicUserEntityProvider;
}
