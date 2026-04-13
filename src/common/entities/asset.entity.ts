import { Entity, PrimaryColumn, Column } from 'typeorm';

export type LinkStatus = 'online' | 'offline';
export type HealthStatus = 'good' | 'warning' | 'fault';

@Entity('assets')
export class AssetEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 100 })
  type: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  temp: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  vib: number;

  @Column('enum', { enum: ['online', 'offline'], default: 'online' })
  link: LinkStatus;

  @Column('enum', { enum: ['good', 'warning', 'fault'], default: 'good' })
  health: HealthStatus;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  lastUpdate: Date;
}
