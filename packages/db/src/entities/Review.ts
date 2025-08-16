import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Listing, (listing) => listing.reviews)
  listing!: Listing;

  @Column('float')
  rating!: number;

  @Column('simple-json', { nullable: true })
  aspects?: any;

  @Column('text', { nullable: true })
  text?: string;
}
