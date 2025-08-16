import { Controller, Get, Param } from '@nestjs/common';
import { ProvenanceService } from './provenance.service';

@Controller('provenance')
export class ProvenanceController {
  constructor(private readonly provenanceService: ProvenanceService) {}

  @Get(':listingId')
  list(@Param('listingId') id: string) {
    return this.provenanceService.forListing(Number(id));
  }
}
