import path from 'path';
import {config} from 'dotenv';
config();
const  mode  = process.env.DATABASE === 'database.sqlite'? process.env.DATABASE : 'database_test.sqlite';
module.exports ={
  client: 'sqlite3',
  connection:{
    filename: path.resolve(__dirname, 'src', 'database', mode),
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  useNullAsDefault: true,
};