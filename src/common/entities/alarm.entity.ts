import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type AlarmSeverity = 'critical' | 'warning' | 'info';

@Entity('alarms')
@Index(['assetId', 'timestamp'])
export class AlarmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  assetId: string;

  @Column('varchar', { length: 100 })
  type: string;

  @Column('enum', { enum: ['critical', 'warning', 'info'] })
  severity: AlarmSeverity;

  @Column('text')
  message: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column('timestamp', { nullable: true })
  acknowledgedAt: Date | null;

  @Column('uuid', { nullable: true })
  acknowledgedBy: string | null;
}
