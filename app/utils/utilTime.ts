/**
 * 将 MySQL TIMESTAMP 转换为 RFC3339 标准格式 'YYYY-MM-DD HH:mm:ss'
 * @param timestamp MySQL TIMESTAMP，可以是 Date 对象、字符串或数字时间戳
 * @returns 格式化后的字符串，格式为 'YYYY-MM-DD HH:mm:ss'
 */
export function formatMySQLTimestampToRFC3339(timestamp: Date | string | number): string {
    try {
        let date: Date;

        // 将输入转换为 Date 对象
        if (timestamp instanceof Date) {
            date = timestamp;
        }  else {
            date = new Date(timestamp);
        }

        // 格式化为 YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.error('格式化时间戳失败:', error);
        throw error;
    }
}