const api = require('lambda-api')();

api.get('/', async (req, res) => {
  return { status: 'ok' };
});

api.get('/crawler', async (req, res) => {
  try {
    //const drizzle = require('drizzle-orm/libsql').drizzle;
    const createClient = require('@libsql/client').createClient;
    //const { chat } = require('./schema');

    const client = createClient({ url: 'libsql://gpthunters-boemekeld.turso.io', authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTAwOTUzMDIsImlkIjoiYjM1YjEwNjctMjkyNS0xMWVlLTk1ODEtMWE4NjY5MWUyODU2In0.T93iddRYFyfM0hKZo0zxaM131V8TbtZN80uC8NWlNSJz7EHhW-pMptnAlH6ZcIAZlaocfc_PRrFbjnXgdW99Dw' });
    
    //const db = drizzle(client);

    /*
    console.log('aki 1');

    const ri = await client.execute({
      sql: "INSERT INTO chat VALUES(?,?,?,?,?,?,?)",
      args: [
        '2',
        'url',
        'author',
        'date',
        'content',
        'votes',
        'create_at'
      ]
    });
    console.log(ri);
    */

    console.log('aki 2');

    const rs = await client.execute({
      sql: "SELECT id FROM chat",
      args: []
    });
    console.log(rs);

    /*
    const ret = await db.insert(chat).values({
      id: '1',
      url: 'url',
      author: 'author',
      date: 'date',
      content: 'content',
      votes: 'votes',
      create_at: 'create_at'
    }).returning();
    console.log(ret.returning);
    */

    //const result = await db.select().from(chat).all();

    //console.log(result);
    return {
      statusCode: 200,
      rs
    };

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