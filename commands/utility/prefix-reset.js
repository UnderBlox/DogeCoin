const prefixSchema = require('../../models/prefix')
const prefix = require('../../config.json').prefix
const { confirmation } = require('@reconlx/discord.js')

module.exports = {
    name : 'prefix-reset',
    cooldown: 3,
    aliases : ['reset-prefix', 'resetprefix', 'prefixreset'],
    category : 'utility',
    description : 'Resets the prefix of the server where the command sender is in!',
    run : async(client, message, args) => {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('You Do Not Have Permission To Use That Command!')
        message.channel.send("Are you sure you want to reset the prefix?").then(async (msg) => {
            const emoji = await confirmation(msg, message.author, ['✅', '❌'], 10000)
            if(emoji === '✅') {
                msg.delete()
                await prefixSchema.findOneAndDelete({ Guild : message.guild.id })
                message.channel.send(`The prefix has been reset to **${prefix}**`)
            }
            if(emoji === '❌') {
                msg.delete()
                message.channel.send('reset prefix has been cancelled.')
            }
        })
    }
}