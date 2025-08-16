import { AppDataSource } from '../data-source';
import { Listing, Station, ListingStationMetric, PricingProvenance, Score } from '../entities';

const stationsSeed = [
  { name: 'KLCC', line: 'LRT Kelana Jaya', lat: 3.1579, lon: 101.7123 },
  { name: 'Masjid Jamek', line: 'LRT Kelana Jaya', lat: 3.1514, lon: 101.6958 },
  { name: 'Bukit Bintang', line: 'MRT Kajang', lat: 3.1469, lon: 101.7115 },
  { name: 'Mid Valley', line: 'KTM Komuter', lat: 3.1186, lon: 101.6774 },
  { name: 'Bangsar', line: 'LRT Kelana Jaya', lat: 3.1272, lon: 101.6784 }
];

async function seed() {
  await AppDataSource.initialize();
  const stationRepo = AppDataSource.getRepository(Station);
  const listingRepo = AppDataSource.getRepository(Listing);
  const metricRepo = AppDataSource.getRepository(ListingStationMetric);
  const provRepo = AppDataSource.getRepository(PricingProvenance);
  const scoreRepo = AppDataSource.getRepository(Score);

  for (const s of stationsSeed) {
    if (!(await stationRepo.findOne({ where: { name: s.name } }))) {
      await stationRepo.save(stationRepo.create(s));
    }
  }

  const stations = await stationRepo.find();

  for (let i = 1; i <= 8; i++) {
    const listing = listingRepo.create({
      title: `Demo Listing ${i}`,
      price_rm: 1500 + i * 100,
      pets_ok: i % 2 === 0
    });
    await listingRepo.save(listing);
    const station = stations[i % stations.length];
    await metricRepo.save(metricRepo.create({
      listing,
      station,
      distance_m: 500 + i * 10,
      walk_time_min_day: (500 + i * 10) / 80
    }));
    await provRepo.save(provRepo.create({ listing, source_name: 'Demo', source_url: 'http://example.com', captured_at: new Date(), price_rm: listing.price_rm }));
    await scoreRepo.save(scoreRepo.create({ listing, transit_score: 0.8, safety_score: 0.7, amenity_score: 0.6, trust_score: 0.9, livability: 0.75, price_confidence: 0.9 }));
  }

  await AppDataSource.destroy();
}

seed();
