import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

new Worker('gtfs', async () => ({ status: 'gtfs ok' }), { connection });
new Worker('osm', async () => ({ status: 'osm ok' }), { connection });
new Worker('price_extract', async () => ({ price: 1234 }), { connection });
new Worker('dedupe', async () => ({ clusters: [] }), { connection });
new Worker('scoring', async () => ({ success: true }), { connection });

console.log('Worker queues running');
