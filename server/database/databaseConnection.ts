import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function initDatabasePool() {
    const runtimeConfig = useRuntimeConfig();
    try {
        pool = mysql.createPool({
            host: runtimeConfig.mysql.host,
            port: parseInt(runtimeConfig.mysql.port),
            user: runtimeConfig.mysql.user,
            password: runtimeConfig.mysql.password,
            database: runtimeConfig.mysql.database,
            multipleStatements: true,
            waitForConnections: true,
            connectionLimit: 10, // 连接池中最大连接数
            queueLimit: 0, // 队列中等待连接的最大数量（0表示无限制）
        });
        console.log('数据库连接池初始化成功');
        return pool;
    } catch (error) {
        console.error('数据库连接池初始化失败:', error);
        throw error;
    }
}

async function _getDatabaseConnection(): Promise<mysql.PoolConnection> {
    if (pool) {
        return pool.getConnection();
    } else {
        throw new Error('数据库连接池未初始化。');
    }
}

export async function withDatabaseConnection<T>(callback: (connection: mysql.PoolConnection) => Promise<T>, max_retry: number = 5, retry_delay_ms: number = 1000): Promise<T> {
    let retries = 0;

    while (true) {
        try {
            const connection = await _getDatabaseConnection();
            try {
                const result = await callback(connection);
                return result;
            } finally {
                connection.release();
            }
        } catch (error) {
            if (error.message === '数据库连接池未初始化。' && retries < max_retry) {
                console.log(`数据库连接池未初始化，${retry_delay_ms}ms后重试 (${retries + 1}/${max_retry})...`);
                await new Promise(resolve => setTimeout(resolve, retry_delay_ms));
                retries++;
            } else {
                throw error;
            }
        }
    }
}

export async function closeDatabasePool() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('数据库连接池已关闭');
    }
}
