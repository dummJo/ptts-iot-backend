import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlarmEntity } from '../common/entities/alarm.entity';
import { AlarmDto } from '../common/dtos/dashboard.dto';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(AlarmEntity) private alarmRepo: Repository<AlarmEntity>,
  ) {}

  async acknowledgeAlarm(id: string, userId: string): Promise<AlarmDto> {
    const alarm = await this.alarmRepo.findOne({ where: { id } });

    if (!alarm) {
      throw new NotFoundException(`Alarm with id ${id} not found`);
    }

    alarm.acknowledgedAt = new Date();
    alarm.acknowledgedBy = userId;

    await this.alarmRepo.save(alarm);

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
