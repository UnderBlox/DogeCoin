const { Client, Message, MessageEmbed } = require('discord.js');
const { toLocaleString } = require('../../details/additionalMsg');

const client = require('../../main');
const profileSchema = require("../../models/profile");
const computerSchema = require("../../models/computer");
const skillsSchema = require("../../models/skills");

const upgradesInfo = require("../../details/pcupgrades");

const pcStats = async (message, member, client, args) => {
    const emoji = await client.dgemoji()

    computerSchema.findOne({ User: member.id }, async(err, data) => {
        if(data){
            const embed = new MessageEmbed()
            .setColor('#fcdb03')
            .setAuthor(`${member.user.username}'s Computer`, member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(`https://i.imgur.com/hwQQrNx.png`)
            .addFields(
                { name: `💻 Computer`, value: `**Bank: ${emoji} ${data.Bank} / ${data.MaxBank}** \n **Income Per Hour: ${emoji} ${data.IncomePerHour}** \n\n **Overheated: ${data.Overheated}** \n **Overheat Chance: ${data.OverheatChance}%**`, inline: true},
                { name: `🧊 Cooler:`, value: `Level ${data.Cooler}`},
                { name: `😎 Graphics:`, value: `Level ${data.Graphics}`},
                { name: `🏦 Bank:`, value: `Level ${data.BankLevel}`},
            )
            .setTimestamp()
            .setFooter('📅');

            message.channel.send(embed)
        } else return message.lineReplyNoMention(`You Or That User Does Not Have A Computer Yet!`);
    })
}

const pcUps = async (message, member, client, args) => {
    const emoji = await client.dgemoji()
    const prefix = await client.prefix(message)

    computerSchema.findOne({ User: member.id }, async(err, data) => {
        if(data){
            const embed = new MessageEmbed()
            .setColor('#fcdb03')
            .setAuthor(`${member.user.username}'s Computer Upgrades`, member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `🧊 Cooler \`Lvl ${data.Cooler}\``, value: `Reduce The Chances Of Your Computer Overheating. \n Cost: **${parseInt(upgradesInfo.find(key => key.Upgrade == "cooler").Cost * data.Cooler)} ${emoji} **\n \`${prefix}pc upgrade cooler\` \n\u200B`},
                { name: `😎 Graphics \`Lvl ${data.Graphics}\``, value: `Increases Your Income Per Hour But Increases The Chance Of Your Computer Overheating. \n Cost: **${parseInt(upgradesInfo.find(key => key.Upgrade == "graphics").Cost * data.Graphics)} ${emoji}** \n \`${prefix}pc upgrade graphics\` \n\u200B`},
                { name: `🏦 Bank \`Lvl ${data.BankLevel}\``, value: `Increases Your Computer's Bank Space. \n Cost: **${parseInt(upgradesInfo.find(key => key.Upgrade == "bank").Cost * data.BankLevel)} ${emoji}** \n \`${prefix}pc upgrade bank\``},
            )
            .setTimestamp()
            .setFooter('📅');

            message.channel.send(embed)
        } else return message.lineReplyNoMention(`You Or That User Does Not Have A Computer Yet!`);
    })
}

const pcUp = async (message, member, client, args, bal) => {
    const emoji = await client.dgemoji()
    const prefix = await client.prefix(message)

    var upgrade = args[1]
    var amount = 1

    if(args[2]){
        if(parseInt(args[2]) % 1 != 0 || parseInt(args[2]) <= 0) return message.reply('Amount Must Be A Whole Number!')
        amount = parseInt(args[2])
    }

    computerSchema.findOne({ User: message.author.id }, async(err, data) => {
        if(data){
            if(upgrade){   
                upgrade.toLowerCase()
                const upgrd = upgradesInfo.find(key => upgrade && key.Upgrade == upgrade);
                if(upgrd){
                    if(upgrd.Upgrade == "cooler"){
                        if(data.OverheatChance == 1){
                            return message.lineReplyNoMention(`You Cannot Upgrade Your Cooler Any More, Its Already Maxed Out!`);
                        };
                    };

                    const dataUpgrade = data[upgrd.UpgradeName]
                    const cost = parseInt((upgrd.Cost * dataUpgrade) * amount)
                    if(bal >= cost){
                        await client.rmv(message.author.id, cost);
                        data[upgrd.UpgradeName] = data[upgrd.UpgradeName] + amount;
                        await data.save();

                        if(upgrd.AddOrRemove == "Add"){
                            data[upgrd.DataUpgrade] = data[upgrd.DataUpgrade] + parseInt(upgrd.Amount * amount);
                            await data.save(); 
                        } else {
                            data[upgrd.DataUpgrade] = data[upgrd.DataUpgrade] - parseInt(upgrd.Amount * amount);
                            await data.save();
                        }

                        message.lineReply(`**You Upgraded Your ${upgrd.Upgrade} To Level ${data[upgrd.UpgradeName]}!**`);

                    } else return message.lineReplyNoMention(`You Are To Broke To Buy That Upgrade Lmao`);
                } else return message.lineReplyNoMention(`Please Provide A Valid Upgrade, You Can Do \`${prefix}pc upgrades\` To See A List Of Upgrades!`);
            } else return message.lineReplyNoMention(`Please Provide An Upgrade, You Can Do \`${prefix}pc upgrades\` To See A List Of Upgrades!`);
        } else return message.lineReplyNoMention(`You Or That User Does Not Have A Computer Yet!`);
    })
}


module.exports = {
    name : 'pc',
    cooldown: 1,
    category : 'economy',
    usage: `pc {@user} || upgrades || upgrade {upgrade}`,
    description : `Returns The User's Computer!`,
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.member;

        const bal = await client.bal(member.id);

        const upgradesAliases = [`upgrades`, `upgrds`, `ups`, `upgrs`]
        const upgradeAliases = [`upgrade`, `upgrd`, `up`, `upgr`]

        if(bal >= 0 && bal !== false){
            if(!args[0]){
                pcStats(message, member, client, args)
            } else {
                if(upgradesAliases.find(e => e == args[0].toLowerCase())){
                    pcUps(message, member, client, args)
                } else {
                    if(upgradeAliases.find(e => e == args[0].toLowerCase())){
                        pcUp(message, member, client, args, bal)
                    }
                }
            }
        } else return message.lineReplyNoMention(`You Or That User Does Not Have A Profile Yet!`);
    }
}
