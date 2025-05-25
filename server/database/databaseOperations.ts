import {withDatabaseConnection} from "~~/server/database/databaseConnection";

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
