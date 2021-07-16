const { Client, Message, MessageEmbed } = require('discord.js');
const { toLocaleString } = require('../../details/additionalMsg');

const client = require('../../main');
const profileSchema = require("../../models/profile");
const computerSchema = require("../../models/computer");
const skillsSchema = require("../../models/skills");

module.exports = {
    name : 'claim',
    cooldown: 5,
    category : 'economy',
    description : `Claim The Doge Coins Inside The Computer's Bank!`,
    run: async (client, message, args) => {
        const bal = await client.bal(message.author.id);
        const emoji = await client.dgemoji()

        if(bal >= 0 && bal !== false){
            computerSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    if(data.Bank != 0){

                        const amount = data.Bank

                        data.Bank = 0;
                        await data.save();

                        await client.add(message.author.id, amount)
                        
                        message.lineReply(`**You Claimed ${emoji} ${amount} From Your Computer's Bank!**`);

                    } else return message.lineReplyNoMention(`Your Computer's Bank Is Empty!`);
                } else return message.lineReplyNoMention(`You Do Not Have A Computer Yet!`);
            })
        } else return message.lineReplyNoMention(`You Do Not Have A Profile Yet!`);
    }
}
