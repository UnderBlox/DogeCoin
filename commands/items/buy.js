const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const invSchema = require("../../models/inventory");

const items = require("../../items/items");

module.exports = {
    name : 'buy',
    cooldown: 3,
    category : 'items',
    usage: `buy {item}`,
    description : `Buy Items From The Shop!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)
        
        var amount = parseInt(args[1])

        if(bal >= 0 && bal !== false){
            if(!args[0]) return message.reply(`Please Include A Valid Item!`)
            const item = items.find(key => args[0].toLowerCase() && key.IDs.includes(args[0].toLowerCase()));
            if(item){
                if(item.Buyable){
                    if(amount){
                        if(!amount % 1 != 0 || !amount <= 0){     
                            if(bal >= parseInt(item.BuyPrice * amount)){
                                await client.addItem(message.author.id, args[0].toLowerCase(), amount)
                                await client.rmv(message.author.id, parseInt(item.BuyPrice * amount))
    
                                const embed = new MessageEmbed()
                                .setColor('#fcdb03')
                                .setAuthor(`${message.author.username} Bought An Item`, message.member.user.displayAvatarURL({ dynamic: true }))
                                .setDescription(`**${message.author.username}** Bought **${amount} ${item.ShowName}** For ${emoji} \`${parseInt(item.BuyPrice * amount)}\`!`)
                                .setTimestamp()
                                .setFooter('📅');
    
                                message.channel.send(embed)
                            } else return message.reply(`You Do Not Have Enough Doge Coins For That Item!`)
                        }
                    } else {
                        if(bal >= item.BuyPrice){
                            await client.addItem(message.author.id, args[0].toLowerCase(), 1)
                            await client.rmv(message.author.id, item.BuyPrice)
    
                            const embed = new MessageEmbed()
                            .setColor('#fcdb03')
                            .setAuthor(`${message.author.username} Bought An Item`, message.member.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`**${message.author.username}** Bought **1 ${item.ShowName}** For ${emoji} \`${item.BuyPrice}\`!`)
                            .setTimestamp()
                            .setFooter('📅');
    
                            message.channel.send(embed)
                        } else return message.reply(`You Do Not Have Enough Doge Coins For That Item!`)
                    }
                } else return message.reply(`That's Not A Valid Item From The Shop!`)
            } else return message.reply(`That's Not A Valid Item From The Shop!`)
        } else {
            await client.rmvCooldown(message.author.id, "buy", 3);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
