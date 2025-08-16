import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingProvenance } from '@transit/db';
import { ProvenanceController } from './provenance.controller';
import { ProvenanceService } from './provenance.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingProvenance])],
  controllers: [ProvenanceController],
  providers: [ProvenanceService]
})
export class ProvenanceModule {}
