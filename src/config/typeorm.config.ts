import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const datasourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: [__dirname + '/../database/*{.ts,.js}'],
  extra: {
    charset: 'utf8mb4_0900_ai_ci',
  },
  driver: require('mysql2'),
  charset: 'utf8mb4',
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(datasourceOptions);

export default dataSource;
