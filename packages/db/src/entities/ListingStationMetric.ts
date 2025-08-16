import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';
import { Station } from './Station';

@Entity('listing_station_metrics')
export class ListingStationMetric {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Listing, (listing) => listing.stationMetrics)
  listing!: Listing;

  @ManyToOne(() => Station, (station) => station.listingMetrics)
  station!: Station;

  @Column('int')
  distance_m!: number;

  @Column('float')
  walk_time_min_day!: number;
}
