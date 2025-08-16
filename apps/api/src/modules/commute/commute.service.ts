import { Injectable } from '@nestjs/common';

@Injectable()
export class CommuteService {
  plan(listingId: number, arrival: string) {
    return {
      listingId,
      arrival,
      options: {
        fastest: [
          { type: 'walk', minutes: 5 },
          { type: 'lrt', line: 'Kelana Jaya', minutes: 15 }
        ],
        fewestTransfers: [
          { type: 'walk', minutes: 7 },
          { type: 'mrt', line: 'Kajang', minutes: 20 }
        ],
        mostReliable: [
          { type: 'walk', minutes: 6 },
          { type: 'lrt', line: 'Kelana Jaya', minutes: 18 }
        ]
      }
    };
  }
}
