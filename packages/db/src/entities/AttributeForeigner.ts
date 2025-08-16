import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Listing } from './Listing';

@Entity('attributes_foreigner')
export class AttributeForeigner {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Listing, (listing) => listing.foreignerAttrs)
  listing!: Listing;

  @Column('boolean', { default: false })
  english_lease!: boolean;
}
