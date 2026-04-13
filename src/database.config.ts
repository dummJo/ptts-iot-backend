import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AssetEntity } from './common/entities/asset.entity';
import { TelemetryEntity } from './common/entities/telemetry.entity';
import { AlarmEntity } from './common/entities/alarm.entity';
import { ConfigEntity } from './common/entities/config.entity';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ptts_iot',
  entities: [AssetEntity, TelemetryEntity, AlarmEntity, ConfigEntity],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
};
