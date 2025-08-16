import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Listing, (listing) => listing.scores)
  listing!: Listing;

  @Column('float')
  transit_score!: number;

  @Column('float')
  safety_score!: number;

  @Column('float')
  amenity_score!: number;

  @Column('float')
  trust_score!: number;

  @Column('float')
  livability!: number;

  @Column('float')
  price_confidence!: number;
}
