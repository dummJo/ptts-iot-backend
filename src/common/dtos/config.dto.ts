import { IsArray, IsString, IsObject } from 'class-validator';

export class ConfigStateDto {
  @IsArray()
  @IsString({ each: true })
  apiKeys: string[];
}

export class SaveConfigDto {
  @IsArray()
  @IsString({ each: true })
  apiKeys: string[];
}
