import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1690000000000 implements MigrationInterface {
  name = 'InitTables1690000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS stations (id SERIAL PRIMARY KEY, name text, line text, lat float, lon float)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS listings (id SERIAL PRIMARY KEY, title text, description text, price_rm numeric, occupants_max int, pets_ok boolean, building_entry_geom geography(Point,4326), created_at timestamptz default now(), updated_at timestamptz default now())`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS listing_station_metrics (id SERIAL PRIMARY KEY, listing_id int references listings(id), station_id int references stations(id), distance_m int, walk_time_min_day float)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS pricing_provenance (id SERIAL PRIMARY KEY, listing_id int references listings(id), source_name text, source_url text, captured_at timestamptz, price_rm numeric)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS scores (id SERIAL PRIMARY KEY, listing_id int references listings(id), transit_score float, safety_score float, amenity_score float, trust_score float, livability float, price_confidence float)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS attributes_foreigner (id SERIAL PRIMARY KEY, listing_id int references listings(id), english_lease boolean)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS reviews (id SERIAL PRIMARY KEY, listing_id int references listings(id), rating float, aspects jsonb, text text)`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS moderation (id SERIAL PRIMARY KEY, listing_id int references listings(id), risk_level text, flags jsonb)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS moderation`);
    await queryRunner.query(`DROP TABLE IF EXISTS reviews`);
    await queryRunner.query(`DROP TABLE IF EXISTS attributes_foreigner`);
    await queryRunner.query(`DROP TABLE IF EXISTS scores`);
    await queryRunner.query(`DROP TABLE IF EXISTS pricing_provenance`);
    await queryRunner.query(`DROP TABLE IF EXISTS listing_station_metrics`);
    await queryRunner.query(`DROP TABLE IF EXISTS listings`);
    await queryRunner.query(`DROP TABLE IF EXISTS stations`);
  }
}
