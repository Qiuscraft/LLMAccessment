export default defineEventHandler(async (event) => {
  // 根据请求方法分发到不同的处理函数
  const method = event.method;

  if (method === 'GET') {
    // 处理 GET 请求
    try {
      // 获取查询参数
      const query = getQuery(event);

      // 导入getOriginalQuestions函数
      const { getOriginalQuestions } = await import('../database/operations/databaseOperationOriginalQuestion');

      // 构建查询选项
      const options = {
        // 处理基本过滤条件
        id: query.id ? parseInt(query.id as string) : undefined,
        latestVersion: query.latestVersion as string,
        version: query.version as string,
        title: query.title as string,
        content: query.content as string,

        // 处理日期范围过滤
        createdAtStart: query.createdAtStart ? new Date(query.createdAtStart as string) : undefined,
        createdAtEnd: query.createdAtEnd ? new Date(query.createdAtEnd as string) : undefined,
        updatedAtStart: query.updatedAtStart ? new Date(query.updatedAtStart as string) : undefined,
        updatedAtEnd: query.updatedAtEnd ? new Date(query.updatedAtEnd as string) : undefined,
        versionCreatedAtStart: query.versionCreatedAtStart ? new Date(query.versionCreatedAtStart as string) : undefined,
        versionCreatedAtEnd: query.versionCreatedAtEnd ? new Date(query.versionCreatedAtEnd as string) : undefined,

        // 处理分页和排序参数
        pageSize: query.pageSize ? parseInt(query.pageSize as string) : 10,
        pageNumber: query.pageNumber ? parseInt(query.pageNumber as string) : 1,
        orderBy: (query.orderBy as 'ASC' | 'DESC') || 'DESC'
      };

      // 调用数据库操作函数获取数据
      return await getOriginalQuestions(options);
    } catch (error) {
      console.error('获取问题列表失败:', error);
      throw createError({
        statusCode: 500,
        statusMessage: error.message || '获取问题列表失败'
      });
    }
  } else if (method === 'POST') {
    // 处理 POST 请求
    try {
      const body = await readBody(event);
      const { version, title, content } = body;

      const { newOriginalQuestion } = await import('../database/operations/databaseOperationOriginalQuestion');
      const id = await newOriginalQuestion(version, title, content);
      return { id };
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      });
    }
  } else {
    // 处理不支持的方法
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }
});
