const client = require('../main')

const config = require('../config.json')
const prefix = config.prefix

client.on('ready', () => {
    client.user.setActivity(`${prefix}help`)
    console.log(`${client.user.username} ✅`)
})