const { createClient } = require("@libsql/client");
const { v4: uuidv4 } = require('uuid');
const { sqlClient } = require('./config');

class ChatRepository {

    constructor() {
        this.client = createClient(sqlClient);
    }

    async findAll(chat) {
        return "String"
    }

}


module.exports = {
    ChatRepository
}