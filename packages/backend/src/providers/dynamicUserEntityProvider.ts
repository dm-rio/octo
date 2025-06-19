import { LoggerService } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

export class DynamicUserEntityProvider implements EntityProvider {
  private readonly logger: LoggerService;
  private connection?: EntityProviderConnection;
  private readonly userCache = new Map<string, DeferredEntity>();

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  getProviderName(): string {
    return `dynamic-user-provider`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    this.logger.debug('Dynamic User Entity Provider connected');
  }

  async addOrUpdateUser(userEntity: Entity): Promise<void> {
    const entityKey = `${userEntity.kind}:${userEntity.metadata.namespace}/${userEntity.metadata.name}`;
    const deferredEntity: DeferredEntity = {
      entity: userEntity,
      locationKey: `dynamic-user-provider:${entityKey}`,
    };
    this.userCache.set(entityKey, deferredEntity);

    if (this.connection) {
      try {
        await this.connection.applyMutation({
          type: 'full',
          entities: Array.from(this.userCache.values()),
        });

        this.logger.debug(
          `Successfully added/updated user entity: ${entityKey}`,
        );
      } catch (error) {
        this.logger.error(`Failed to add/update user entity: ${entityKey}`);
        throw error;
      }
    } else {
      this.logger.warn('No connection available to catalog');
    }
  }

  async removeUser(entityKey: string): Promise<void> {
    const deferredEntity = this.userCache.get(entityKey);
    if (deferredEntity && this.connection) {
      this.userCache.delete(entityKey);

      await this.connection.applyMutation({
        type: 'full',
        entities: Array.from(this.userCache.values()),
      });
    }
  }

  // Called by catalog during startup to get all entities
  async getAllUsers(): Promise<DeferredEntity[]> {
    return Array.from(this.userCache.values());
  }
}
