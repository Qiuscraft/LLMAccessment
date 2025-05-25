import { initDatabasePool, closeDatabasePool } from '~~/server/database/databaseConnection';
import { initDatabaseTable } from '~~/server/database/initDatabaseTable';

// 创建一个专门的 Nitro 插件来管理数据库生命周期
export default defineNitroPlugin(async (nitroApp) => {
  // 初始化数据库连接池
  initDatabasePool();

  // 初始化数据库表结构
  await initDatabaseTable();

  // 在应用关闭时关闭数据库连接
  nitroApp.hooks.hookOnce('close', async () => {
    await closeDatabasePool();
  });
});
