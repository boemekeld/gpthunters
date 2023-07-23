const api = require('lambda-api')();

api.get('/', async (req, res) => {
  return { status: 'ok' };
});

api.get('/crawler', async (req, res) => {
  try {
    const GptCrawler = require("gpt-crawler");

    const url = req.query["url"] || '';
  
    if (url.indexOf('https://chat.openai.com/share/') != 0) {
      return { statusCode: 401 };
    }
  
    const crawler = new GptCrawler();
    const data = await crawler.fetchUrl(url);
  
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        data,
      }),
    };
    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
});

exports.handler = async (event, context) => {
  return await api.run(event, context);
};