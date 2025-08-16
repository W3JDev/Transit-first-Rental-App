import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entities from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: Object.values(entities),
  migrations: ['src/migrations/*.ts'],
  synchronize: false
});
