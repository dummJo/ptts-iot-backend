import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from '../common/entities/config.entity';
import { ConfigStateDto, SaveConfigDto } from '../common/dtos/config.dto';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity) private configRepo: Repository<ConfigEntity>,
  ) {}

  async getConfig(): Promise<ConfigStateDto> {
    let config = await this.configRepo.findOne({ where: { id: 1 } });

    if (!config) {
      config = this.configRepo.create({
        id: 1,
        apiKeys: [],
        settings: {},
      });
      await this.configRepo.save(config);
    }

    return {
      apiKeys: config.apiKeys || [],
    };
  }

  async saveConfig(saveConfigDto: SaveConfigDto): Promise<ConfigStateDto> {
    let config = await this.configRepo.findOne({ where: { id: 1 } });

    if (!config) {
      config = this.configRepo.create({
        id: 1,
        apiKeys: saveConfigDto.apiKeys,
        settings: {},
      });
    } else {
      config.apiKeys = saveConfigDto.apiKeys;
      config.updatedAt = new Date();
    }

    await this.configRepo.save(config);

    return {
      apiKeys: config.apiKeys,
    };
  }
}
