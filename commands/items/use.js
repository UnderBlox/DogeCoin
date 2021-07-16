const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const invSchema = require("../../models/inventory");

const items = require("../../items/items");
const usableItems = require("../../items/usableitems");

const usableitemrewards = require("../../functions/usableitemrewards");

const RandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


module.exports = {
    name : 'use',
    cooldown: 1,
    category : 'items',
    usage: `use {item}`,
    description : `Use Items In Your Inventory!`,
    run: async (client, message, args) => {
        if(!args[0]) return message.lineReply(`Please Include A Valid Item To Use!`)
        const item = items.find(key => args[0].toLowerCase() && key.IDs.includes(args[0].toLowerCase()));
        if(!item) return message.lineReply(`That's Not A Valid Item!`)
        if(!item.Usable) return message.lineReply(`You Can't Use That Item!`)
        const usableitem = usableItems.find(key => args[0].toLowerCase() && key.IDs.includes(args[0].toLowerCase()));
        if(!usableitem) return message.lineReply(`There Was An Error While Trying To Find That Item, Please Report This Bug To The Creator!`)

        var useAmount = 1

        if(args[1]){
            if(parseInt(args[1]) % 1 != 0 || parseInt(args[1]) <= 0) return message.reply('Amount Must Be A Whole Number!')
            useAmount = parseInt(args[1])
        }

        const invData = await invSchema.findOne({ User: message.author.id });
        if(!invData) return message.lineReply(`You Don't Have An Inventory!`)
        const hasItem = Object.keys(invData.Inventory).includes(usableitem.Name);
        if(!hasItem || invData.Inventory[usableitem.Name] == 0) return message.lineReply(`You Don't Have That Item!`)
        if(invData.Inventory[usableitem.Name] >= useAmount){
            const emoji = await client.dgemoji()

            const bal = await client.bal(message.author.id)
    
            if(bal >= 0 && bal !== false){
                if(usableitem.RewardType == "coins"){
                    const amount = parseInt(RandomNum(usableitem.MinReward, usableitem.MaxReward) * useAmount)
                    await client.add(message.author.id, amount)
                    await client.rmvItem(message.author.id, usableitem.IDs[0], useAmount)
    
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .setAuthor(`${message.author.username} Used An Item`, message.member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You Used ${useAmount} **${usableitem.ShowName}** And Got ${emoji} **${amount}**!`)
                    .setTimestamp()
                    .setFooter('📅');
    
                    message.channel.send(embed)
                } else{
                    if(usableitem.RewardType == "custom"){
                        usableitemrewards.run(client, message, usableitem.IDs[0], useAmount)
                    }
                }
            } else {
                await client.rmvCooldown(message.author.id, "daily", 72000);
                message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
            } 
        } else return message.lineReply(`You Don't Have That Amount Of Items!`)
    }
}
