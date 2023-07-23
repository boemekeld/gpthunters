const api = require('lambda-api')();

api.get('/', async (req, res) => {
  return { status: 'ok' };
});

api.get('/crawler', async (req, res) => {
  try {
    const url = req.query["url"] || '';

    const createClient = require('@libsql/client').createClient;
    const client = createClient({ url: 'libsql://gpthunters-boemekeld.turso.io', authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTAwOTUzMDIsImlkIjoiYjM1YjEwNjctMjkyNS0xMWVlLTk1ODEtMWE4NjY5MWUyODU2In0.T93iddRYFyfM0hKZo0zxaM131V8TbtZN80uC8NWlNSJz7EHhW-pMptnAlH6ZcIAZlaocfc_PRrFbjnXgdW99Dw' });

    const rs = await client.execute({
      sql: "SELECT * FROM chat WHERE url = ?",
      args: [url]
    });
    if (rs.rows.length != 0) {
      const response = {
        statusCode: 200,
        body: {
          data: rs.rows[0]
        },
      };
      return response;
    }

    const GptCrawler = require("gpt-crawler");

    if (url.indexOf('https://chat.openai.com/share/') != 0) {
      return { statusCode: 401 };
    }
  
    const crawler = new GptCrawler();
    const data = await crawler.fetchUrl(url);
  
    await client.execute({
      sql: "INSERT INTO chat VALUES(?,?,?,?,?,?,?)",
      args: [
        Math.random(),
        url,
        data.author,
        data.date,
        JSON.stringify(data.content),
        '0',
        'create_at'
      ]
    });

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