import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';

@Entity('moderation')
export class Moderation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Listing, (listing) => listing.moderation)
  listing!: Listing;

  @Column('text')
  risk_level!: string;

  @Column('jsonb', { nullable: true })
  flags?: any;
}
