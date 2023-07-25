const { createClient } = require("@libsql/client");
const { v4: uuidv4 } = require('uuid');

class ChatRepository {

    async findAll(chat) {
        return "String"
    }

}


module.exports = {
    ChatRepository
}