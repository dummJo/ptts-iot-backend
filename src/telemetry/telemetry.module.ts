import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { AssetEntity } from '../common/entities/asset.entity';
import { TelemetryEntity } from '../common/entities/telemetry.entity';
import { AlarmEntity } from '../common/entities/alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity, TelemetryEntity, AlarmEntity])],
  providers: [TelemetryService],
  controllers: [TelemetryController],
})
export class TelemetryModule {}
