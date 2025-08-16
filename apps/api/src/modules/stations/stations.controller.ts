import { Controller, Get, Query } from '@nestjs/common';
import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get('near')
  async near(@Query('lat') lat: string, @Query('lon') lon: string) {
    const stations = await this.stationsService.near(Number(lat), Number(lon));
    return { stations };
  }
}
