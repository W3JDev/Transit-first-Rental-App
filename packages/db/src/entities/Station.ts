import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ListingStationMetric } from './ListingStationMetric';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  line!: string;

  @Column('float')
  lat!: number;

  @Column('float')
  lon!: number;

  @OneToMany(() => ListingStationMetric, (m) => m.station)
  listingMetrics!: ListingStationMetric[];
}
