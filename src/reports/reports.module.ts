import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AssetEntity } from '../common/entities/asset.entity';
import { TelemetryEntity } from '../common/entities/telemetry.entity';
import { AlarmEntity } from '../common/entities/alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity, TelemetryEntity, AlarmEntity])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
