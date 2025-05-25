import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export default defineNitroPlugin(async () => {
  try {
    const runtimeConfig = useRuntimeConfig();
    const connection = await mysql.createConnection({
      host: runtimeConfig.mysql.host,
      port: parseInt(runtimeConfig.mysql.port),
      user: runtimeConfig.mysql.user,
      password: runtimeConfig.mysql.password,
      database: runtimeConfig.mysql.database,
      multipleStatements: true
    });

    try {
      // 读取并执行 SQL 文件
      const sqlFilePath = path.resolve(process.cwd(), 'create_table.sql');
      const sql = fs.readFileSync(sqlFilePath, 'utf-8');
      await connection.query(sql);
      console.log('数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化失败:', error);
    } finally {
      await connection.end();
    }
  } catch (connectionError) {
    console.error('数据库连接失败:', connectionError);
  }
});