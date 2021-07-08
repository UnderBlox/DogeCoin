const prefixSchema = require('../../models/prefix')
const { Message } = require('discord.js')

module.exports = {
    name : 'prefix-set',
    cooldown: 3,
    aliases : ['prefixset', 'set-prefix', 'setprefix'],
    category : 'utility',
    usage: `prefix-set {prefix}`,
    description : 'Change the prefix of the server where the command sender is in!',
    run : async(client, message, args) => {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply('You Do Not Have Permission To Use That Command!')
        const res = await args.join(" ")
        if(!res) return message.channel.send('Please specify a prefix to change to.')
        prefixSchema.findOne({ Guild : message.guild.id }, async(err, data) => {
            if(err) throw err;
            if(data) {
                await prefixSchema.findOneAndDelete({ Guild : message.guild.id })
                data = new prefixSchema({
                    Guild : message.guild.id,
                    Prefix : res
                })
                data.save()
                message.channel.send(`Your prefix has been updated to **${res}**`)
            } else {
                data = new prefixSchema({
                    Guild : message.guild.id,
                    Prefix : res
                })
                data.save()
                message.channel.send(`Custom prefix in this server is now set to **${res}**`)
            }
        })
    }
}