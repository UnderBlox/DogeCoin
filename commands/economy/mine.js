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

const minerMessages = [
    `wow such mining`,
    `wow such doge`,
    `such amaze mining`,
    `10/10`,
    `such mining`
];

module.exports = {
    name : 'mine',
    cooldown: 3,
    aliases : ['m'],
    category : 'economy',
    description : `Mine For DogeCoins!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    const skillsData = await skillsSchema.findOne({ User: message.author.id });

                    const rNum = RandomNum(5, 10)
                    const randomMoney = parseInt(rNum + percentageMultiply(data.Multipliers, parseInt(rNum * skillsData.MiningMultipliers)))

                    const addAmount = parseInt(randomMoney)

                    const minersMsg = minerMessages[Math.floor(Math.random() * minerMessages.length)]

                    const randomWorkExp = RandomNum(3, 6)
                    const randomMiningExp = RandomNum(1, 3)
                            
                    await client.add(message.author.id, addAmount);
                    await client.addExp(message, randomWorkExp)
                    await client.addExp(message, randomMiningExp, "Mine")
        
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .addFields(
                        { name: `⛏ Mining`, value: `You Went Mining And Earned ${emoji} **${randomMoney}** \n\n **+${randomMiningExp} Mining Exp** \n **+${randomWorkExp} General Exp**`},
                        { name: `<:DogeMiner:860367472678273045> **Doge Miners:**`, value: `"${minersMsg}"` }
                    )
                    .setTimestamp()
                    .setFooter('📅');
        
                    message.channel.send(embed);

                    client.sendAddMsg(message)
                }
            })
        } else {
            await client.rmvCooldown(message.author.id, "mine", 3);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
