import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetDto } from '../common/dtos/dashboard.dto';
import { AssetEntity } from '../common/entities/asset.entity';

@Controller('api/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get(':id')
  async getAsset(@Param('id') id: string): Promise<AssetDto> {
    return this.assetsService.getAsset(id);
  }

  @Put(':id')
  async updateAsset(
    @Param('id') id: string,
    @Body() updates: Partial<AssetEntity>,
  ): Promise<AssetDto> {
    return this.assetsService.updateAsset(id, updates);
  }
}
