import {withDatabaseConnection} from "~~/server/database/databaseConnection";
import type {OriginalQuestionWithVersion} from "~~/server/database/databaseTypes";

export async function newOriginalQuestion(version: string, title: string | null, content: string): Promise<number> {
    return await withDatabaseConnection(async (connection): Promise<number> => {
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                'INSERT INTO original_question (latest_version, deleted) VALUES (?, ?)',
                [version, false]
            );

            const insertId = result.insertId;
            await connection.execute(
                'INSERT INTO original_question_version (oq_id, version, title, content, deleted) VALUES (?, ?, ?, ?, ?)',
                [
                    insertId,
                    version,
                    title,
                    content,
                    false
                ]
            );

            await connection.commit();
            return insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    });
}

export interface GetOriginalQuestionsOptions {
    id?: number;
    createdAtStart?: Date;
    createdAtEnd?: Date;
    updatedAtStart?: Date;
    updatedAtEnd?: Date;
    latestVersion?: string;
    version?: string;
    title?: string;
    content?: string;
    versionCreatedAtStart?: Date;
    versionCreatedAtEnd?: Date;
    pageSize?: number;
    pageNumber?: number;
    orderBy?: 'ASC' | 'DESC';
    orderField?: 'id' | 'created_at' | 'updated_at' | 'latest_version' | 'version' | 'title' | 'content' | 'version_created_at';
}

/**
 * 查询原始问题列表
 * @param options 查询选项，所有条件均为可选，不提供则不进行筛选
 * @returns 返回符合条件的问题列表，类型为OriginalQuestionWithVersion[]
 */
export async function getOriginalQuestions(options: GetOriginalQuestionsOptions = {}): Promise<{
    data: OriginalQuestionWithVersion[],
    total: number
}> {
    return await withDatabaseConnection(async (connection): Promise<{
        data: OriginalQuestionWithVersion[],
        total: number
    }> => {
        try {
            // 构建查询条件
            const conditions: string[] = ['oq.deleted = FALSE', 'oqv.deleted = FALSE'];
            const params: any[] = [];

            // 添加各种筛选条件
            if (options.id !== undefined) {
                conditions.push('oq.id = ?');
                params.push(options.id);
            }

            if (options.createdAtStart) {
                conditions.push('oq.created_at >= ?');
                params.push(options.createdAtStart);
            }

            if (options.createdAtEnd) {
                conditions.push('oq.created_at <= ?');
                params.push(options.createdAtEnd);
            }

            if (options.updatedAtStart) {
                conditions.push('oq.updated_at >= ?');
                params.push(options.updatedAtStart);
            }

            if (options.updatedAtEnd) {
                conditions.push('oq.updated_at <= ?');
                params.push(options.updatedAtEnd);
            }

            if (options.latestVersion) {
                conditions.push('oq.latest_version LIKE ?');
                params.push(options.latestVersion);
            }

            if (options.version) {
                conditions.push('oqv.version LIKE ?');
                params.push(options.version);
            }

            if (options.title) {
                conditions.push('oqv.title LIKE ?');
                params.push(`%${options.title}%`);
            }

            if (options.content) {
                conditions.push('oqv.content LIKE ?');
                params.push(`%${options.content}%`);
            }

            if (options.versionCreatedAtStart) {
                conditions.push('oqv.created_at >= ?');
                params.push(options.versionCreatedAtStart);
            }

            if (options.versionCreatedAtEnd) {
                conditions.push('oqv.created_at <= ?');
                params.push(options.versionCreatedAtEnd);
            }

            // 构建WHERE子句
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

            // 确定排序方式
            const orderDirection = options.orderBy || 'DESC';
            const orderField = options.orderField || 'id';

            // 计算总记录数
            const countQuery = `
                SELECT COUNT(*) as total
                FROM original_question oq
                JOIN original_question_version oqv ON oq.id = oqv.oq_id
                ${whereClause}
            `;

            const [countRows] = await connection.execute(countQuery, params);
            const total = countRows[0].total;

            // 处理分页
            const limit = options.pageSize || 10;
            const offset = ((options.pageNumber || 1) - 1) * limit;
            const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

            // 构建最终查询
            const query = `
                SELECT 
                    oq.id,
                    oq.created_at,
                    oq.updated_at,
                    oq.latest_version,
                    oqv.version,
                    oqv.title,
                    oqv.content,
                    oqv.created_at as version_created_at
                FROM original_question oq
                JOIN original_question_version oqv ON oq.id = oqv.oq_id
                ${whereClause}
                ORDER BY ${orderField} ${orderDirection}
                ${paginationClause}
            `;

            const [rows] = await connection.execute(query, params);

            // 转换结果类型
            const data = rows.map((row: any): OriginalQuestionWithVersion => ({
                id: row.id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                latest_version: row.latest_version,
                version: row.version,
                title: row.title,
                content: row.content,
                version_created_at: row.version_created_at
            }));

            return {
                data,
                total
            };
        } catch (error) {
            console.error('查询原始问题列表失败:', error);
            throw error;
        }
    });
}

