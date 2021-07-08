const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const invSchema = require("../../models/inventory");
const skillsSchema = require("../../models/skills");

const RandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const percentageMultiply = (percent, num) => {
    const amount = (percent / 100) * num;
    return amount
}

const fisherMessages = [
    `wow such fishing`,
    `wow such doge`,
    `such amaze fishing`,
    `10/10`,
    `such fishing`
];

module.exports = {
    name : 'fish',
    cooldown: 5,
    aliases : ['f'],
    category : 'economy',
    description : `Fish For DogeCoins!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    const skillsData = await skillsSchema.findOne({ User: message.author.id });

                    const rNum = RandomNum(7, 14)
                    const randomMoney = parseInt(rNum + percentageMultiply(data.Multipliers, parseInt(rNum * skillsData.FishingMultipliers)))

                    const addAmount = parseInt(randomMoney)

                    const fisherMsg = fisherMessages[Math.floor(Math.random() * fisherMessages.length)]

                    const randomWorkExp = RandomNum(4, 8)
                    const randomFishingExp = RandomNum(3, 5)
                            
                    await client.add(message.author.id, addAmount);
                    await client.addExp(message, randomWorkExp)
                    await client.addExp(message, randomFishingExp, "Fish")
        
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .addFields(
                        { name: `🎣 Fishing`, value: `You Went Fishing And Earned ${emoji} **${randomMoney}** \n\n **+${randomFishingExp} Fishing Exp** \n **+${randomWorkExp} General Exp**`},
                        { name: `<:FisherDoge:860450252121440267> **Doge Fishers:**`, value: `"${fisherMsg}"` }
                    )
                    .setTimestamp()
                    .setFooter('📅');
                    
                    message.channel.send(embed)

                    client.sendAddMsg(message)
                }
            })
        } else {
            await client.rmvCooldown(message.author.id, "fish", 5);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
