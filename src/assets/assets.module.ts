import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { AssetEntity } from '../common/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity])],
  providers: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
