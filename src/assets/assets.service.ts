import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity } from '../common/entities/asset.entity';
import { AssetDto } from '../common/dtos/dashboard.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(AssetEntity) private assetRepo: Repository<AssetEntity>,
  ) {}

  async getAsset(id: string): Promise<AssetDto> {
    const asset = await this.assetRepo.findOne({ where: { id } });

    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }

    return this.mapAssetDto(asset);
  }

  async updateAsset(id: string, updates: Partial<AssetEntity>): Promise<AssetDto> {
    const asset = await this.assetRepo.findOne({ where: { id } });

    if (!asset) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }

    // Update allowed fields
    if (updates.temp !== undefined) asset.temp = updates.temp;
    if (updates.vib !== undefined) asset.vib = updates.vib;
    if (updates.link !== undefined) asset.link = updates.link;
    if (updates.health !== undefined) asset.health = updates.health;

    asset.lastUpdate = new Date();
    await this.assetRepo.save(asset);

    return this.mapAssetDto(asset);
  }

  private mapAssetDto(asset: AssetEntity): AssetDto {
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      temp: asset.temp,
      vib: asset.vib,
      link: asset.link,
      health: asset.health,
    };
  }
}
