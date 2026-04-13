import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { AssetEntity } from '../common/entities/asset.entity';
import { TelemetryEntity } from '../common/entities/telemetry.entity';
import { AlarmEntity } from '../common/entities/alarm.entity';
import { DashboardDataDto, KPIItemDto, TrendPointDto, StatusSegmentDto, AssetDto, AlarmDto, SystemStateDto, VibrationEntryDto } from '../common/dtos/dashboard.dto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(AssetEntity) private assetRepo: Repository<AssetEntity>,
    @InjectRepository(TelemetryEntity) private telemetryRepo: Repository<TelemetryEntity>,
    @InjectRepository(AlarmEntity) private alarmRepo: Repository<AlarmEntity>,
  ) {}

  async getDashboardData(): Promise<DashboardDataDto> {
    const assets = await this.assetRepo.find();
    const recentTelemetry = await this.telemetryRepo.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
    const activeAlarms = await this.alarmRepo.find({
      where: { acknowledgedAt: IsNull() },
      order: { timestamp: 'DESC' },
      take: 50,
    });

    // Generate KPI data
    const kpiData = this.generateKPIData(assets, recentTelemetry, activeAlarms);

    // Generate trend data
    const trendData = this.generateTrendData(recentTelemetry);

    // Generate status data
    const statusData = this.generateStatusData(activeAlarms);

    // Link summary
    const linkSummary = {
      online: assets.filter(a => a.link === 'online').length,
      offline: assets.filter(a => a.link === 'offline').length,
    };

    // Health summary
    const healthSummary = {
      good: assets.filter(a => a.health === 'good').length,
      warning: assets.filter(a => a.health === 'warning').length,
      fault: assets.filter(a => a.health === 'fault').length,
    };

    // Top assets
    const topAssets = assets.slice(0, 8).map(this.mapAssetDto);

    // Recent alerts
    const recentAlerts = activeAlarms.slice(0, 10).map(this.mapAlarmDto);

    // Vibration bar data
    const vibrationBarData = assets.slice(0, 5).map(a => ({
      name: a.name,
      value: a.vib,
    }));

    // System state
    const system: SystemStateDto = {
      connected: linkSummary.online > 0,
      lastSync: new Date().toISOString(),
    };

    return {
      kpiData,
      trendData,
      statusData,
      linkSummary,
      healthSummary,
      topAssets,
      recentAlerts,
      vibrationBarData,
      system,
    };
  }

  private generateKPIData(
    assets: AssetEntity[],
    telemetry: TelemetryEntity[],
    alarms: AlarmEntity[],
  ): KPIItemDto[] {
    const avgTemp = telemetry.length > 0
      ? (telemetry.reduce((sum, t) => sum + t.temp, 0) / telemetry.length).toFixed(1)
      : '0.0';

    const avgVib = telemetry.length > 0
      ? (telemetry.reduce((sum, t) => sum + t.vib, 0) / telemetry.length).toFixed(2)
      : '0.0';

    const onlineCount = assets.filter(a => a.link === 'online').length;
    const uptime = assets.length > 0 ? ((onlineCount / assets.length) * 100).toFixed(1) : '0.0';

    return [
      {
        label: 'Temperature',
        value: avgTemp,
        unit: '°C',
        sub: 'Current Average',
        trend: '+0.2',
        trendUp: false,
        color: 'from-red-500',
        ledClass: 'led-red',
      },
      {
        label: 'Vibration',
        value: avgVib,
        unit: 'mm/s',
        sub: 'Current Average',
        trend: '-0.5',
        trendUp: true,
        color: 'from-orange-500',
        ledClass: 'led-orange',
      },
      {
        label: 'System Uptime',
        value: uptime,
        unit: '%',
        sub: 'Assets Online',
        trend: '+2.3',
        trendUp: true,
        color: 'from-green-500',
        ledClass: 'led-green',
      },
      {
        label: 'Active Alarms',
        value: alarms.length.toString(),
        unit: 'Count',
        sub: 'Unacknowledged',
        trend: '-1',
        trendUp: true,
        color: 'from-yellow-500',
        ledClass: 'led-yellow',
      },
    ];
  }

  private generateTrendData(telemetry: TelemetryEntity[]): TrendPointDto[] {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = telemetry.filter(t => new Date(t.timestamp) > hourAgo);

    return recent.slice(-24).map(t => ({
      time: new Date(t.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temp: t.temp,
      vib: t.vib,
    }));
  }

  private generateStatusData(alarms: AlarmEntity[]): StatusSegmentDto[] {
    const criticalCount = alarms.filter(a => a.severity === 'critical').length;
    const warningCount = alarms.filter(a => a.severity === 'warning').length;
    const infoCount = alarms.filter(a => a.severity === 'info').length;

    return [
      { name: 'Critical', value: criticalCount, color: '#ef4444' },
      { name: 'Warning', value: warningCount, color: '#f59e0b' },
      { name: 'Info', value: infoCount, color: '#3b82f6' },
    ];
  }

  private mapAssetDto(asset: AssetEntity): AssetDto {
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      temp: asset.temp,
      vib: asset.vib,
      link: asset.link,
      health: asset.health,
    };
  }

  private mapAlarmDto(alarm: AlarmEntity): AlarmDto {
    return {
      id: alarm.id,
      asset: alarm.assetId,
      type: alarm.type,
      severity: alarm.severity,
      message: alarm.message,
      time: new Date(alarm.timestamp).toLocaleTimeString(),
    };
  }
}
