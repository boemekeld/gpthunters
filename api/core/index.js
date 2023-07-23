const api = require('lambda-api')();

api.get('/', async (req, res) => {
  return { status: 'ok' };
});

api.get('/crawler', async (req, res) => {
  try {

    /*
    const drizzle = require('drizzle-orm/libsql').drizzle;
    const createClient = require('@libsql/client').createClient;

    const client = createClient({ url: 'DATABASE_URL', authToken: 'DATABASE_AUTH_TOKEN' });
     
    const db = drizzle(client);
     
    const result = await db.select().from(users).all()
    */

    const GptCrawler = require("gpt-crawler");

    const url = req.query["url"] || '';
  
    if (url.indexOf('https://chat.openai.com/share/') != 0) {
      return { statusCode: 401 };
    }
  
    const crawler = new GptCrawler();
    const data = await crawler.fetchUrl(url);
  
    const response = {
      statusCode: 200,
      body: {
        data,
      },
    };
    return response;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
});

exports.handler = async (event, context) => {
  return await api.run(event, context);
};