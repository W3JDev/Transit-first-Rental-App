import { Controller, Get, Query, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('search')
  async search(@Query('q') q?: string) {
    const listings = await this.listingsService.search(q);
    return { listings };
  }

  @Get('listing/:id')
  async getListing(@Param('id') id: string) {
    const listing = await this.listingsService.findOne(Number(id));
    if (!listing) throw new NotFoundException();
    return listing;
  }

  @Post('report')
  async report(@Body() body: any) {
    return { status: 'ok', body };
  }
}
