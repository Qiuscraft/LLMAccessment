import fs from 'fs';
import path from 'path';
import { withDatabaseConnection } from "~~/server/database/databaseConnection";

export async function databaseInitTable() {
  const sqlFilePath = path.resolve(process.cwd(), 'create_table.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf-8');

  await withDatabaseConnection(5, 1000, async (connection) => {
    await connection.query(sql);
  });

  console.log('数据库表初始化成功');
}
