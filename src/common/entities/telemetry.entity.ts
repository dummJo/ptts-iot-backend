import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('telemetry')
@Index(['assetId', 'timestamp'])
export class TelemetryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  assetId: string;

  @Column('decimal', { precision: 5, scale: 2 })
  temp: number;

  @Column('decimal', { precision: 8, scale: 2 })
  vib: number;

  @CreateDateColumn()
  timestamp: Date;
}
