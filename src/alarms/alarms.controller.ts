import { Controller, Patch, Param } from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { AlarmDto } from '../common/dtos/dashboard.dto';

@Controller('api/alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Patch(':id/ack')
  async acknowledgeAlarm(@Param('id') id: string): Promise<AlarmDto> {
    // In a real application, you would extract the user ID from the JWT token
    return this.alarmsService.acknowledgeAlarm(id, 'system');
  }
}
