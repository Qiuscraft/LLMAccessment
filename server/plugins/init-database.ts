import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Nitro 插件：服务启动时初始化数据库表
export default defineNitroPlugin(async () => {
  try {
    const runtimeConfig = useRuntimeConfig();
    const connection = await mysql.createConnection({
      host: runtimeConfig.sql.host,
      user: runtimeConfig.sql.user,
      password: runtimeConfig.sql.password,
      database: runtimeConfig.sql.database,
    });

    try {
      // 读取并执行 SQL 文件
      const sqlFilePath = path.resolve(process.cwd(), 'create_table.sql');
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
});
