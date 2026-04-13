import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AssetEntity } from '../common/entities/asset.entity';
import { TelemetryEntity } from '../common/entities/telemetry.entity';
import { AlarmEntity } from '../common/entities/alarm.entity';
import { ReportSummaryDto, AssetReportRowDto, ReportPeriod } from '../common/dtos/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(AssetEntity) private assetRepo: Repository<AssetEntity>,
    @InjectRepository(TelemetryEntity) private telemetryRepo: Repository<TelemetryEntity>,
    @InjectRepository(AlarmEntity) private alarmRepo: Repository<AlarmEntity>,
  ) {}

  async getReport(period: ReportPeriod): Promise<ReportSummaryDto> {
    const { from, to } = this.getDateRange(period);

    const assets = await this.assetRepo.find();
    const telemetry = await this.telemetryRepo.find({
      where: { timestamp: Between(from, to) },
    });
    const alarms = await this.alarmRepo.find({
      where: { timestamp: Between(from, to) },
    });

    const assetReportRows = await Promise.all(
      assets.map(asset => this.generateAssetRow(asset, telemetry, alarms)),
    );

    const criticalAlarms = alarms.filter(a => a.severity === 'critical').length;
    const warningAlarms = alarms.filter(a => a.severity === 'warning').length;

    const avgTemp = telemetry.length > 0
      ? telemetry.reduce((sum, t) => sum + t.temp, 0) / telemetry.length
      : 0;

    const avgVib = telemetry.length > 0
      ? telemetry.reduce((sum, t) => sum + t.vib, 0) / telemetry.length
      : 0;

    const totalOnlineTime = assets.reduce((sum, a) => sum + (a.link === 'online' ? 1 : 0), 0);
    const avgUptime = assets.length > 0 ? (totalOnlineTime / assets.length) * 100 : 0;

    return {
      period,
      dateRange: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      generatedAt: new Date().toISOString(),
      totalNodes: assets.length,
      avgUptime,
      totalAlarms: alarms.length,
      criticalAlarms,
      warningAlarms,
      avgTemp,
      avgVib,
      assets: assetReportRows,
      trendData: [],
    };
  }

  private getDateRange(period: ReportPeriod): { from: Date; to: Date } {
    const to = new Date();
    const from = new Date();

    switch (period) {
      case 'daily':
        from.setDate(to.getDate() - 1);
        break;
      case 'weekly':
        from.setDate(to.getDate() - 7);
        break;
      case 'monthly':
        from.setMonth(to.getMonth() - 1);
        break;
      case '3months':
        from.setMonth(to.getMonth() - 3);
        break;
      case '6months':
        from.setMonth(to.getMonth() - 6);
        break;
      case '12months':
        from.setFullYear(to.getFullYear() - 1);
        break;
      default:
        throw new BadRequestException(`Invalid period: ${period}`);
    }

    return { from, to };
  }

  private async generateAssetRow(
    asset: AssetEntity,
    allTelemetry: TelemetryEntity[],
    allAlarms: AlarmEntity[],
  ): Promise<AssetReportRowDto> {
    const assetTelemetry = allTelemetry.filter(t => t.assetId === asset.id);
    const assetAlarms = allAlarms.filter(a => a.assetId === asset.id);

    const avgTemp = assetTelemetry.length > 0
      ? assetTelemetry.reduce((sum, t) => sum + t.temp, 0) / assetTelemetry.length
      : 0;

    const maxTemp = assetTelemetry.length > 0
      ? Math.max(...assetTelemetry.map(t => t.temp))
      : 0;

    const avgVib = assetTelemetry.length > 0
      ? assetTelemetry.reduce((sum, t) => sum + t.vib, 0) / assetTelemetry.length
      : 0;

    const maxVib = assetTelemetry.length > 0
      ? Math.max(...assetTelemetry.map(t => t.vib))
      : 0;

    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      avgTemp: Math.round(avgTemp * 10) / 10,
      maxTemp: Math.round(maxTemp * 10) / 10,
      avgVib: Math.round(avgVib * 100) / 100,
      maxVib: Math.round(maxVib * 100) / 100,
      uptime: asset.link === 'online' ? 100 : 0,
      alarmCount: assetAlarms.length,
      link: asset.link,
      health: asset.health,
    };
  }
}
