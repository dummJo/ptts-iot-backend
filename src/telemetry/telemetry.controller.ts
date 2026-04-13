import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { DashboardDataDto } from '../common/dtos/dashboard.dto';

@Controller('api/dashboard')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  async getDashboard(): Promise<DashboardDataDto> {
    return this.telemetryService.getDashboardData();
  }
}
