import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';

@Entity('pricing_provenance')
export class PricingProvenance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Listing, (listing) => listing.provenance)
  listing!: Listing;

  @Column()
  source_name!: string;

  @Column()
  source_url!: string;

  @Column('datetime')
  captured_at!: Date;

  @Column('numeric')
  price_rm!: number;
}
