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

const farmerMessages = [
    `wow such farming`,
    `wow such doge`,
    `such amaze farming`,
    `10/10`,
    `such farming`
];

module.exports = {
    name : 'farm',
    cooldown: 10,
    aliases : ['h', 'harvest', 'plant'],
    category : 'economy',
    description : `Farm For DogeCoins!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    const skillsData = await skillsSchema.findOne({ User: message.author.id });

                    const rNum = RandomNum(10, 20)
                    const randomMoney = parseInt(rNum + percentageMultiply(data.Multipliers, parseInt(rNum * skillsData.FarmingMultipliers)))

                    const addAmount = parseInt(randomMoney)

                    const farmerMsg = farmerMessages[Math.floor(Math.random() * farmerMessages.length)]

                    const randomWorkExp = RandomNum(5, 10)
                    const randomFarmingExp = RandomNum(5, 7)
                            
                    await client.add(message.author.id, addAmount);
                    await client.addExp(message, randomWorkExp)
                    await client.addExp(message, randomFarmingExp, "Farm")
        
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .addFields(
                        { name: `🌾 Farming`, value: `You Went Farming And Earned ${emoji} **${randomMoney}** \n\n **+${randomFarmingExp} Farming Exp** \n **+${randomWorkExp} General Exp**`},
                        { name: `<:DogeFarmer:860484248452333578> **Doge Farmers:**`, value: `"${farmerMsg}"` }
                    )
                    .setTimestamp()
                    .setFooter('📅');
        
                    message.channel.send(embed)

                    client.sendAddMsg(message)
                }
            })
        } else {
            await client.rmvCooldown(message.author.id, "farm", 10);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
