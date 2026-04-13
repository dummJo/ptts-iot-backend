import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportSummaryDto, ReportPeriod } from '../common/dtos/report.dto';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReport(@Query('period') period?: string): Promise<ReportSummaryDto> {
    if (!period) {
      throw new BadRequestException('period query parameter is required');
    }

    const validPeriods: ReportPeriod[] = ['daily', 'weekly', 'monthly', '3months', '6months', '12months'];
    if (!validPeriods.includes(period as ReportPeriod)) {
      throw new BadRequestException(`Invalid period. Must be one of: ${validPeriods.join(', ')}`);
    }

    return this.reportsService.getReport(period as ReportPeriod);
  }
}
