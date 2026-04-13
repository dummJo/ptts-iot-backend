import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryModule } from './telemetry/telemetry.module';
import { ConfigModule } from './config/config.module';
import { ReportsModule } from './reports/reports.module';
import { AlarmsModule } from './alarms/alarms.module';
import { AssetsModule } from './assets/assets.module';
import { typeormConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TelemetryModule,
    ConfigModule,
    ReportsModule,
    AlarmsModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
