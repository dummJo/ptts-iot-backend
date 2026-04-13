import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('system_config')
export class ConfigEntity {
  @PrimaryColumn('integer', { default: 1 })
  id: number;

  @Column('simple-array', { default: '' })
  apiKeys: string[];

  @Column('jsonb', { default: '{}' })
  settings: Record<string, unknown>;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
