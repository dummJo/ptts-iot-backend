import { IsString, IsNumber, IsEnum, IsArray, IsObject, IsBoolean } from 'class-validator';

export class TrendPointDto {
  @IsString()
  time: string;

  @IsNumber()
  temp: number;

  @IsNumber()
  vib: number;
}

export class StatusSegmentDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsString()
  color: string;
}

export class KPIItemDto {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsString()
  unit: string;

  @IsString()
  sub: string;

  @IsString()
  trend: string;

  @IsBoolean()
  trendUp: boolean;

  @IsString()
  color: string;

  @IsString()
  ledClass: string;
}

export class AssetDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  temp: number;

  @IsNumber()
  vib: number;

  @IsEnum(['online', 'offline'])
  link: 'online' | 'offline';

  @IsEnum(['good', 'warning', 'fault'])
  health: 'good' | 'warning' | 'fault';
}

export class AlarmDto {
  @IsString()
  id: string;

  @IsString()
  asset: string;

  @IsString()
  type: string;

  @IsEnum(['critical', 'warning', 'info'])
  severity: 'critical' | 'warning' | 'info';

  @IsString()
  message: string;

  @IsString()
  time: string;
}

export class SystemStateDto {
  @IsBoolean()
  connected: boolean;

  @IsString()
  lastSync: string;
}

export class VibrationEntryDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;
}

export class DashboardDataDto {
  @IsArray()
  kpiData: KPIItemDto[];

  @IsArray()
  trendData: TrendPointDto[];

  @IsArray()
  statusData: StatusSegmentDto[];

  @IsObject()
  linkSummary: { online: number; offline: number };

  @IsObject()
  healthSummary: { good: number; warning: number; fault: number };

  @IsArray()
  topAssets: AssetDto[];

  @IsArray()
  recentAlerts: AlarmDto[];

  @IsArray()
  vibrationBarData: VibrationEntryDto[];

  @IsObject()
  system: SystemStateDto;
}
