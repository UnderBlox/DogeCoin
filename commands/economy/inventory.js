const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const invSchema = require("../../models/inventory");

const items = require("../../items/items");

function read_prop(obj, prop) {
    return obj[prop];
}

module.exports = {
    name : 'inventory',
    cooldown: 1,
    aliases : ['inv'],
    category : 'economy',
    description : `Returns A List Of Items Inside The Player's Inventory!`,
    run: async (client, message, args) => {
        
        const member = message.mentions.members.first() || message.author;

        invSchema.findOne({ User: member.id }, async(err, data) => {
            if(!data) return message.channel.send(`The User's Inventory Is Empty!`)

            var pageNum = args[0]
            pageNum --

            var itemNum = 0
            var maxItemNum = 5 * pageNum

            var hasItem = 0

            var page = args[0]

            if(args[0]){
                if(page % 1 != 0 || page <= 0) return message.reply("Please Provide A Positive Number!");

                mappedData = Object.keys(data.Inventory).map((key) => {
                    itemNum ++
                    if(itemNum > maxItemNum){
                        const item = items.find((val) => key == val.Name);
                        if(item){
                            if(data.Inventory[key] && data.Inventory[key] > 0){
                                const itemID = items.find((val) => val.Name == key).IDs;
                                hasItem ++
                                return `**${item.ShowName}** ━ ${data.Inventory[key]} \n ItemID: \`${itemID[0]}\` \n\n`;
                            } else {
                                itemNum --
                            }
                        }
                    }
                }).join(" ");

            } else {

                page = 1

                mappedData = Object.keys(data.Inventory).map((key) => {
                    if(itemNum < 5){
                        itemNum ++
                        const item = items.find((val) => key == val.Name);
                        if(item){
                            if(data.Inventory[key] && data.Inventory[key] > 0){
                                const itemID = items.find((val) => val.Name == key).IDs;
                                hasItem ++
                                return `**${item.ShowName}** ━ ${data.Inventory[key]} \n Item ID: \`${itemID[0]}\` \n\n`;
                            } else {
                                itemNum --
                            }
                        }
                    }
                }).join(" ");

            }
            
            if(hasItem == 0) return message.reply("You Do Not Have That Many Pages!");

            const embed = new MessageEmbed()
            .setColor('#f5e371')
            .setTitle(`${member.username}'s Inventory: `)
            .setDescription(`${mappedData}`)
            .setTimestamp()
            .setFooter(`Page ${page}`);

            message.channel.send(embed)
        })
    }
}
