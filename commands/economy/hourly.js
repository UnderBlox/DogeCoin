const { Client, Message, MessageEmbed } = require('discord.js');
const { toLocaleString } = require('../../details/additionalMsg');

const profileSchema = require("../../models/profile");
const skillsSchema = require("../../models/skills");

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
    `Here's Your Hourly Reward, Little One.`,
];

module.exports = {
    name : 'hourly',
    cooldown: 3600,
    category : 'economy',
    description : `Redeem Your Hourly Reward!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){

                    const rNum = RandomNum(500, 1000)
                    const randomMoney = parseInt(rNum + percentageMultiply(data.Multipliers, parseInt(rNum)))

                    const addAmount = parseInt(randomMoney)

                    const DogeGodMsg = DogeGodMessages[Math.floor(Math.random() * DogeGodMessages.length)]

                    const randomWorkExp = RandomNum(7, 15)
                            
                    await client.add(message.author.id, addAmount);
                    await client.addExp(message, randomWorkExp)
        
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .addFields(
                        { name: `😋 Hourly Reward`, value: `The Doge God Gave You ${emoji} **${randomMoney.toLocaleString()}** \n **+${randomWorkExp} General Exp**`},
                        { name: `<:DogeGod:860687685177573436> **Doge God:**`, value: `"${DogeGodMsg}"` }
                    )
                    .setTimestamp()
                    .setFooter('📅');
        
                    message.channel.send(embed)

                    client.sendAddMsg(message)
                }
            })
        } else {
            await client.rmvCooldown(message.author.id, "hourly", 3600);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
