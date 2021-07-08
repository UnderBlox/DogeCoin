const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");

const RandomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const percentageMultiply = (percent, num) => {
    const amount = (percent / 100) * num;
    return amount
}

const bossMessages = [
    `wow such doge`,
    `wow such work`,
    `such amaze`,
    `10/10`,
    `such wow`
];

module.exports = {
    name : 'work',
    cooldown: 45,
    aliases : ['w'],
    category : 'economy',
    description : `Work For DogeCoins!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()

        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    const rNum = RandomNum(25, 100)
                    const randomMoney = parseInt(rNum + percentageMultiply(data.Multipliers, rNum))

                    const rNum2 = RandomNum(25, 50)
                    const randomMoney2 = parseInt(rNum2 + percentageMultiply(data.Multipliers, rNum2))

                    const addAmount = parseInt(randomMoney + randomMoney2)
                    
                    const bossMsg = bossMessages[Math.floor(Math.random() * bossMessages.length)]

                    const randomWorkExp = RandomNum(3, 7)

                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .addFields(
                        { name: `💼 Working`, value: `You Went Work And Earn ${emoji} **${randomMoney}** \n Doge Boss Very Impress, Give ${emoji} **${randomMoney2}** More \n\n **+${randomWorkExp} General Exp**`},
                        { name: `<:Doge:860451620574593025> **Boss:**`, value: `"${bossMsg}"`}
                    )
                    .setTimestamp()
                    .setFooter('📅');
        
                    message.channel.send(embed)
        
                    await client.add(message.author.id, addAmount);
                    await client.addExp(message, randomWorkExp)
                    
                    client.sendAddMsg(message)
                }
            })
        } else {
            await client.rmvCooldown(message.author.id, "work", 45);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        } 
    }
}
