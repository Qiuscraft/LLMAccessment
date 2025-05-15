import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    try {
      // 读取并执行 SQL 文件
      const sqlFilePath = path.resolve(__dirname, 'create_table.sql');
      const sql = fs.readFileSync(sqlFilePath, 'utf-8');
      await connection.query(sql);
    } catch (error) {
      console.error('数据库初始化失败:', error);
    } finally {
      await connection.end();
    }
  } catch (connectionError) {
    console.error('数据库连接失败:', connectionError);
  }
};
