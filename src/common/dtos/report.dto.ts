import { IsString, IsNumber, IsEnum, IsArray, IsObject, IsDateString } from 'class-validator';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | '12months';

export class AssetReportRowDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  avgTemp: number;

  @IsNumber()
  maxTemp: number;

  @IsNumber()
  avgVib: number;

  @IsNumber()
  maxVib: number;

  @IsNumber()
  uptime: number;

  @IsNumber()
  alarmCount: number;

  @IsEnum(['online', 'offline'])
  link: 'online' | 'offline';

  @IsEnum(['good', 'warning', 'fault'])
  health: 'good' | 'warning' | 'fault';
}

export class ReportSummaryDto {
  @IsEnum(['daily', 'weekly', 'monthly', '3months', '6months', '12months'])
  period: ReportPeriod;

  @IsObject()
  dateRange: { from: string; to: string };

  @IsDateString()
  generatedAt: string;

  @IsNumber()
  totalNodes: number;

  @IsNumber()
  avgUptime: number;

  @IsNumber()
  totalAlarms: number;

  @IsNumber()
  criticalAlarms: number;

  @IsNumber()
  warningAlarms: number;

  @IsNumber()
  avgTemp: number;

  @IsNumber()
  avgVib: number;

  @IsArray()
  assets: AssetReportRowDto[];

  @IsArray()
  trendData: any[];
}
