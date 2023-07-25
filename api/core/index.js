const createClient = require('@libsql/client').createClient;
const client = createClient({ url: 'libsql://gpthunters-boemekeld.turso.io', authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTAwOTUzMDIsImlkIjoiYjM1YjEwNjctMjkyNS0xMWVlLTk1ODEtMWE4NjY5MWUyODU2In0.T93iddRYFyfM0hKZo0zxaM131V8TbtZN80uC8NWlNSJz7EHhW-pMptnAlH6ZcIAZlaocfc_PRrFbjnXgdW99Dw' });
const { v4: uuidv4 } = require('uuid');

const lambda = require('lambda-api')

const api = lambda({
  cors: true,
  corsAllowOrigin: '*',
});

function choiceRandom(lista) {
  let index = Math.floor(Math.random() * lista.length)
  return lista[index]
}

api.get("/teste", async function teste(req, res) {
  let lista = [true, true, false]
  let choice = choiceRandom(lista)
  if (choice) throw new Error("Erro teste")
  return res.status(201).json({ mensagem: "ok" })
})

const errorHandler1 = (err, req, res, next) => {
  console.error('Erro detectado em errorHandler1:', err);
  res.status(500).json({ error: 'Ocorreu um erro no servidor.', message: err.message });
};

api.get('/erro', withTryCatch(async (req, res, next) => {
  throw new Error('Erro de exemplo');
}));

api.use(errorHandler1);

api.get('/', async (req, res) => {
  return { status: 'ok' };
});

api.get('/list', async (req, res) => {
  try {
    res.cors();
    const rs = await client.execute({
      sql: "SELECT * FROM chat",
      args: []
    });
    return { status: 'ok', chats: rs.rows };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
});

api.get('/table', async (req, res) => {
  try {
    let rs = null;
    rs = await client.execute({
      sql: `
        DROP TABLE chat;
      `,
      args: []
    });
    console.log(rs);
    rs = await client.execute({
      sql: `
        CREATE TABLE chat (
          id TEXT PRIMARY KEY,
          title TEXT,
          url TEXT,
          author TEXT,
          date TEXT,
          content TEXT,
          votes INTEGER
        );
      `,
      args: []
    });
    console.log(rs);
    /*
    rs = await client.execute({
      sql: "INSERT INTO chat VALUES(?,?,?,?,?,?,?)",
      args: [
        uuidv4(),
        'title',
        'url',
        'author',
        'date',
        'content',
        1
      ]
    });
    console.log(rs);
    */
    return { status: 'ok' };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
});

api.get('/crawler', async (req, res) => {
  try {
    res.cors();
    const url = req.query["url"] || '';

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
    data.content = JSON.stringify(data.content);

    await client.execute({
      sql: "INSERT INTO chat VALUES(?,?,?,?,?,?,?)",
      args: [
        uuidv4(),
        data.title,
        url,
        data.author,
        data.date,
        data.content,
        1
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

api.use((err, req, res, next) => {
  return res.status(500).json({ error: err.message, type: err.type });
});

exports.handler = async (event, context) => {
  return await api.run(event, context);
};