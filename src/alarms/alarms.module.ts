import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from './alarms.service';
import { AlarmsController } from './alarms.controller';
import { AlarmEntity } from '../common/entities/alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity])],
  providers: [AlarmsService],
  controllers: [AlarmsController],
})
export class AlarmsModule {}
