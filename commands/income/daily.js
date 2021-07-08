const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const skillsSchema = require("../../models/skills");
const invSchema = require("../../models/inventory");

const RandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const percentageMultiply = (percent, num) => {
    const amount = (percent / 100) * num;
    return amount
}

const DogeGodMessages = [
    `Good Luck On Your Journey.`,
    `I Must Say I'm Very Impressed.`,
    `Here's Your Daily Reward, Little One.`,
];

module.exports = {
    name : 'daily',
    cooldown: 72000,
    category : 'economy',
    description : `Redeem Your Daily Reward!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    const invData = await invSchema.findOne({ User: message.author.id });

                    const rNum = RandomNum(4000, 7000)
                    const randomMoney = parseInt(rNum + percentageMultiply(data.Multipliers, parseInt(rNum)))

                    const addAmount = parseInt(randomMoney)

                    const DogeGodMsg = DogeGodMessages[Math.floor(Math.random() * DogeGodMessages.length)]

                    const randomWorkExp = RandomNum(20, 45)
                            
                    await client.add(message.author.id, addAmount);
                    await client.addExp(message, randomWorkExp)
                    await client.addItem(message.author.id, "dailybox", 1)
        
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .addFields(
                        { name: `😎 Daily Reward`, value: `The Doge God Gave You ${emoji} **${randomMoney.toLocaleString()}** And **1 🎁 Daily Box!** \n **+${randomWorkExp} General Exp**`},
                        { name: `<:DogeGod:860687685177573436> **Doge God:**`, value: `"${DogeGodMsg}"` }
                    )
                    .setTimestamp()
                    .setFooter('📅');
        
                    message.channel.send(embed)

                    client.sendAddMsg(message)
                }
            })
        } else {
            await client.rmvCooldown(message.author.id, "daily", 72000);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
