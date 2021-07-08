const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const invSchema = require("../../models/inventory");

const items = require("../../items/items");

module.exports = {
    name : 'sell',
    cooldown: 3,
    category : 'economy',
    description : `Sell Items From Your Inventory!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)
        
        const amount = parseInt(args[1])

        const data = await invSchema.findOne({ User: message.author.id });

        if(bal >= 0 && bal !== false){
            if(!args[0]) return message.reply(`Please Include A Valid Item!`)
            const item = items.find(key => args[0].toLowerCase() && key.IDs.includes(args[0].toLowerCase()));
            if(item){
                if(item.Sellable){
                    if(data.Inventory[item.Name]){
                        if(amount){
                            if(!amount % 1 != 0 || !amount <= 0){
                                await client.rmvItem(message.author.id, args[0].toLowerCase(), amount)
                                await client.add(message.author.id, parseInt(item.SellPrice * amount))
    
                                const embed = new MessageEmbed()
                                .setColor('#fcdb03')
                                .setAuthor(`${message.author.username} Bought An Item`, message.member.user.displayAvatarURL({ dynamic: true }))
                                .setDescription(`**${message.author.username}** Sold **${amount} ${item.ShowName}** For ${emoji} \`${parseInt(item.SellPrice * amount)}\`!`)
                                .setTimestamp()
                                .setFooter('📅');
    
                                message.channel.send(embed)
                            }
                        } else {
                            await client.rmvItem(message.author.id, args[0].toLowerCase(), 1)
                            await client.add(message.author.id, item.SellPrice)
    
                            const embed = new MessageEmbed()
                            .setColor('#fcdb03')
                            .setAuthor(`${message.author.username} Bought An Item`, message.member.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`**${message.author.username}** Sold **1 ${item.ShowName}** For ${emoji} \`${item.SellPrice}\`!`)
                            .setTimestamp()
                            .setFooter('📅');
    
                            message.channel.send(embed)
                        }
                    } else return message.reply(`You Do Not Have That Item In Your Inventory!`)
                } else return message.reply(`That Item Isn't Sellable!`)
            } else return message.reply(`That's Not A Valid Item From Your Inventory!`)
        } else {
            await client.rmvCooldown(message.author.id, "sell", 3);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
