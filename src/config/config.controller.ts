import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigStateDto, SaveConfigDto } from '../common/dtos/config.dto';

@Controller('api/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(): Promise<ConfigStateDto> {
    return this.configService.getConfig();
  }

  @Post()
  async saveConfig(@Body() saveConfigDto: SaveConfigDto): Promise<ConfigStateDto> {
    return this.configService.saveConfig(saveConfigDto);
  }
}
