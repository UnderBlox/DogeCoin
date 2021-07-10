const { Client, Message, MessageEmbed } = require('discord.js');
const { toLocaleString } = require('../../details/additionalMsg');

const client = require('../../main');
const profileSchema = require("../../models/profile");

module.exports = {
    name : 'tutorial',
    cooldown: 5,
    aliases : ['tut'],
    category : 'economy',
    description : `Learn How To Play The Bot!`,
    run: async (client, message, args) => {
        const prefix = await client.prefix(message)

        const member = message.member;

        const bal = await client.bal(member.id);
        const emoji = await client.dgemoji()

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: member.id }, async(err, data) => {
                data.Tutorial = 1
                await data.save();

                message.channel.send(`**Hey, ${message.author}! Welcome To The Tutorial! \n\nFirst, You Can Use The \`${prefix}profile\` To Look At Your Profile! \nYou Can End The Tutorial By Saying \`end\`**`)
            })
        } else return message.lineReplyNoMention(`You Do Not Have A Profile Yet! You Can Create One By Using \`${prefix}start\`!`);
    }
}
