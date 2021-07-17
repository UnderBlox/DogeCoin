const { Client, Message, MessageEmbed } = require('discord.js');

const inventorySchema = require("../models/inventory");
const profileSchema = require("../models/profile");
const pcSchema = require("../models/computer");

module.exports = {
    run: async (client, message, itemid, useamount) => {
        if(itemid == "mysterygift"){
            await client.rmvItem(message.author.id, itemid, 1)

            new pcSchema({
                User: message.author.id,
                IncomePerHour: 25,

                MaxBank: 500,
                Bank: 0,

                OverheatChance: 25,
                Overheated: false,

                Cooler: 1,
                Graphics: 1,
                Hardware: 1,
            }).save();

            const embed = new MessageEmbed()
            .setColor('#fcdb03')
            .setAuthor(`${message.author.username} Used An Item`, message.member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`You Used 1 **📦 Mystery Gift** And Now You Have A **💻 Computer**! This Computer Can Automatically Mine Doge Coin For You!`)
            .setTimestamp()
            .setFooter('📅');

            message.channel.send(embed)
        }
    }
}