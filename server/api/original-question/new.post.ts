export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { version, title, content } = body;

  try {
    const { newOriginalQuestion } = await import('../../database/databaseOperations');
    const id = await newOriginalQuestion(version, title, content);
    return { id };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});

