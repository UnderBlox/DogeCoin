const { Client, Message, MessageEmbed } = require('discord.js');

const client = require('../../main');

const cooldownsSchema = require("../../models/cooldowns");

const cooldowns = require("../../details/cooldowns");

function secondsToHms(d) {
    if(!d < 1) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        if(!h == 0){
            var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
            return hDisplay
        } else if(!m == 0){
            var mDisplay = m > 0 ? m + (m == 1 ? "m" : "m") : "";
            return mDisplay
        } else {
            var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
            return sDisplay
        }
    }
}

const checkCd = async (cd, cmdName) => {
    if(cd){
        const cmd = cooldowns.find(key => cmdName.toLowerCase() && key.Command.includes(cmdName.toLowerCase()))
        const current_time = parseInt(Date.now() / 1000)

        const expiration_time = (parseInt(cd / 1000)) + cmd.Time

        const time = Math.abs(parseInt(current_time - expiration_time))
        if(expiration_time < current_time){
            return `✅ **Ready**`
        } else {
            return `❌ ${secondsToHms(time)}`
        }
    } else return `✅ **Ready**`
}

module.exports = {
    name : 'cooldowns',
    cooldown: 1,
    aliases : ['c', 'cd', 'cds'],
    category : 'economy',
    description : `Check What Command Is / Isn't On Cooldown!`,
    run: async (client, message, args) => {
        const prefix = await client.prefix()

        const data = await cooldownsSchema.findOne({ User: message.author.id });

        const fish = data.Cooldown.get("fish")
        const farm = data.Cooldown.get("farm")
        const mine = data.Cooldown.get("mine")
        const work = data.Cooldown.get("work")
        const daily = data.Cooldown.get("daily")
        const hourly = data.Cooldown.get("hourly")

        const fishCd = await checkCd(fish, "fish")
        const farmCd = await checkCd(farm, "farm")
        const mineCd = await checkCd(mine, "mine")
        const workCd = await checkCd(work, "work")
        const dailyCd = await checkCd(daily, "daily")
        const hourlyCd = await checkCd(hourly, "hourly")

        const embed = new MessageEmbed()
        .setColor('#fcdb03')
        .setAuthor(`${message.author.username}'s Cooldowns`, message.member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: `💼 Working`, value: `${workCd} \n\u200B`, inline: true},
            { name: `⛏ Mining`, value: `${mineCd} \n\u200B`, inline: true},
            { name: `🎣 Fishing`, value: `${fishCd} \n\u200B`, inline: true}, 
            { name: `🌾 Farming`, value: `${farmCd} \n`, inline: true},
            { name: `😋 Hourly`, value: `${hourlyCd} \n`, inline: true},
            { name: `😎 Daily`, value: `${dailyCd} \n`, inline: true},
        )
        .addField('᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼᲼', '<:DogeGod:860687685177573436> **Doge God:** \n "Patience Is The Key To Being The Best."')
        .setTimestamp()
        .setFooter('📅');

        message.channel.send(embed)
    }
}
