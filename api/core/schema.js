const pgTable = require('drizzle-orm/pg-core').pgTable;
const text = require('drizzle-orm/pg-core').text;
 
const chat = pgTable('chat', {
  id: text('id').primaryKey(),
  url: text('url'),
  author: text('author'),
  date: text('date'),
  content: text('content'),
  votes: text('votes'),
  create_at: text('create_at')
});

module.exports = { chat };