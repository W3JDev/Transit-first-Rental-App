import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Station } from './Station';
import { ListingStationMetric } from './ListingStationMetric';
import { PricingProvenance } from './PricingProvenance';
import { Score } from './Score';
import { AttributeForeigner } from './AttributeForeigner';
import { Review } from './Review';
import { Moderation } from './Moderation';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('numeric')
  price_rm!: number;

  @Column('int', { nullable: true })
  occupants_max?: number;

  @Column('boolean', { default: false })
  pets_ok!: boolean;

  @Column('geometry', { nullable: true })
  building_entry_geom?: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;

  @OneToMany(() => ListingStationMetric, (m) => m.listing)
  stationMetrics!: ListingStationMetric[];

  @OneToMany(() => PricingProvenance, (p) => p.listing)
  provenance!: PricingProvenance[];

  @OneToMany(() => Score, (s) => s.listing)
  scores!: Score[];

  @OneToMany(() => AttributeForeigner, (a) => a.listing)
  foreignerAttrs!: AttributeForeigner[];

  @OneToMany(() => Review, (r) => r.listing)
  reviews!: Review[];

  @OneToMany(() => Moderation, (m) => m.listing)
  moderation!: Moderation[];
}
