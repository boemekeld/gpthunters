const api = require('lambda-api')();

api.get('/', async (req, res) => {
  return { status: 'ok' };
});

api.get('/crawler', async (req, res) => {
  const GptCrawler = require("gpt-crawler");

  const url = "https://chat.openai.com/share/fdf7971b-8978-4150-9ed3-40dab3dde0bd";

  const crawler = new GptCrawler();
  const data = await crawler.fetchUrl(url);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      data,
    }),
  };
  return response;
});

exports.handler = async (event, context) => {
  return await api.run(event, context);
};