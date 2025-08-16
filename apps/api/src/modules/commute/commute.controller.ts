import { Controller, Get, Query } from '@nestjs/common';
import { CommuteService } from './commute.service';

@Controller('commute')
export class CommuteController {
  constructor(private readonly commuteService: CommuteService) {}

  @Get('plan')
  plan(@Query('listingId') listingId: string, @Query('arrival') arrival: string) {
    return this.commuteService.plan(Number(listingId), arrival);
  }
}
