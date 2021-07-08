const { Client, Message, MessageEmbed } = require('discord.js');

const profileSchema = require("../../models/profile");
const invSchema = require("../../models/inventory");

const items = require("../../items/items");
const usableItems = require("../../items/usableitems");

function read_prop(obj, prop) {
    return obj[prop];
}

module.exports = {
    name : 'shop',
    cooldown: 3,
    category : 'economy',
    description : `Returns A List Of Items Available To Be Bought On The Shop!`,
    run: async (client, message, args) => {

        const emoji = await client.dgemoji()
        const prefix = await client.prefix()
        const bal = await client.bal(message.author.id)

        if(bal >= 0 && bal !== false){
            var pageNum = args[0]
            pageNum --
    
            var page = parseInt(args[0])
    
            if(!pageNum){
                pageNum = 1
                page = 1
            }
    
            var itemNum = 0
            var maxItemNum = 5 * page
    
            var hasItem = 0
    
            var isInfo = false
    
            if(args[0]){
                if(args[0] % 1 == 0 && args[0] >= 1 && typeof parseInt(args[0]) == 'number'){
                    if(!page <= 0){
                        if(maxItemNum >= 6 && page != 1){
                            mappedData = Object.keys(items).map((key) => {
                                itemNum ++
                                if(itemNum > maxItemNum){
                                    const item = items[key];
                                    if(item){
                                        if(item.Buyable && item.InShop){
                                            hasItem ++
                                            const itemID = item.IDs;
                                            return `**${item.ShowName}** ━ ${emoji} ${item.BuyPrice} \n **Item IDs:** \`${itemID}\` \n\n`;
                                        }
                                    }
                                }
                            }).join(" ");
                        } else {
                            mappedData = Object.keys(items).map((key) => {
                                if(itemNum < 5){
                                    itemNum ++
                                    const item = items[key];
                                    if(item){
                                        if(item.Buyable && item.InShop){
                                            hasItem ++
                                            const itemID = item.IDs;
                                            return `**${item.ShowName}** ━ ${emoji} ${item.BuyPrice} \n **Item IDs:** \`${itemID}\` \n\n`;
                                        }
                                    }
                                }
                            }).join(" ");
                        }
                    }
                } else {
                    const item = items.find(key => args[0].toLowerCase() && key.IDs.includes(args[0].toLowerCase()));
                    if(item){ 
                        isInfo = true
                        hasItem = 1
    
                        const itemName = item.ShowName
                        const description = item.Description
    
                        const buyable = item.Buyable
                        const buyprice = item.BuyPrice
    
                        const sellable = item.Sellable
                        const sellprice = item.SellPrice
    
                        var buy
                        var sell
    
                        if(buyable){
                            buy = `${emoji} ${buyprice}`
                        } else {
                            buy = "Unavailable"
                        }
    
                        if(sellable){
                            sell = `${emoji} ${sellprice}`
                        } else {
                            sell = "Unavailable"
                        }
    
                        const embed = new MessageEmbed()
                        .setColor('#f5e371')
                        .setThumbnail(item.InfoImage)
                        .setTitle(`**${itemName}**`)
                        .setDescription(`${description} \n\n **Buy –** ${buy} \n **Sell –** ${sell}`)
                        .setTimestamp()
                        .setFooter(`🛒`);
                
                        message.channel.send(embed)
                    } else {
                        return message.reply("That's Not A Valid Item Id!");
                    }
                }
            } else {
                mappedData = Object.keys(items).map((key) => {
                    if(itemNum < 5){
                        itemNum ++
                        const item = items[key];
                        if(item){
                            if(item.Buyable && item.InShop){
                                hasItem ++
                                const itemID = item.IDs;
                                return `**${item.ShowName}** ━ ${emoji} ${item.BuyPrice} \n **Description:** ${item.Description} \n **Item IDs:** \`${itemID}\` \n\n`;
                            }
                        }
                    }
                }).join(" ");
            }
    
            if(hasItem == 0) return message.reply("The Shop Does Not Have That Many Pages!");
            if(isInfo == false){
                const embed = new MessageEmbed()
                .setColor('#f5e371')
                .setTitle(`<a:DancingDoge:861054037003993138> __Doge Shop__ \n Use \`${prefix}shop {item name}\` To Get A Brief Description Of The Item!`)
                .setDescription(`${mappedData}`)
                .setTimestamp()
                .setFooter(`Page ${page}`);
        
                message.channel.send(embed)
            }
        } else {
            await client.rmvCooldown(message.author.id, "shop", 3);
            message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
        }
    }
}
