const prefixSchema = require('../../models/prefix')
const { Message } = require('discord.js')

module.exports = {
    name : 'prefix',
    cooldown: 3,
    category : 'utility',
    description : 'Returns the prefix of the server where the command sender is in!',
    run : async(client, message, args) => {
        prefixSchema.findOne({ Guild : message.guild.id }, async(err, data) => {
            if(err) throw err;
            if(data) {
                message.channel.send(`The prefix in this server is **${data.Prefix}**`)
            } else {
                message.channel.send(`The prefix in this server is **!**`)
            }
        })
    }
}