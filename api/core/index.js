const GptCrawler = require("gpt-crawler");

exports.handler = async (event) => {
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
};
