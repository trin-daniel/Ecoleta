import knex from 'knex';
import path from 'path';
import {config} from 'dotenv';
config();
const  mode  = process.env.DATABASE === 'database.sqlite'? process.env.DATABASE : 'database_test.sqlite';
const  connection = knex({
  client: 'sqlite3',
  connection:{
    filename: path.resolve(__dirname, mode),
  },
  useNullAsDefault:true,
})
export default connection;