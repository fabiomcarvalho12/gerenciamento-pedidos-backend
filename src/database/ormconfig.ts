import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Admin@123',
  database: 'ecommerce_challenge',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrationsRun: true,
  migrations: ['dist/database/migrations/**/*.js'],
});
