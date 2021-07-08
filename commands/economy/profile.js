const { Client, Message, MessageEmbed } = require('discord.js');
const { toLocaleString } = require('../../details/additionalMsg');

const client = require('../../main');
const profileSchema = require("../../models/profile");
const skillsSchema = require("../../models/skills");

module.exports = {
    name : 'profile',
    cooldown: 1,
    aliases : ['b', 'bal', 'balance', 'pro', 'p', 'rank'],
    category : 'economy',
    description : `Returns The User's Balance!`,
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.member;

        const bal = await client.bal(member.id);
        const emoji = await client.dgemoji()

        if(bal >= 0 && bal !== false){
            profileSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(data){
                    const skillsData = await skillsSchema.findOne({ User: message.author.id });

                    const boxes = Math.floor((data.Exp/(200 * ((1/2) * data.Level))) * 10)
                    const link = "https://youtu.be/rGCxtPLzwO8"
                    const levelBar = `[${"■".repeat(boxes)}${"□".repeat(10 - boxes)}](${link})`
    
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .setAuthor(`${member.user.username}'s Profile`, member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**Rank** \n **${data.Rank}** \n\n **Level** \`${data.Level}\` \n ${levelBar} \n\n **Wallet: ${emoji} ${bal.toLocaleString()}** \n **General Multipliers: ${data.Multipliers}%** \n\n **Skills:**`)
                    .addFields(
                        { name: `⛏ Mining:`, value: `**Level:** \`${skillsData.MiningLevel}\` \n **Exp:** \`${skillsData.MiningExp}/${100 * skillsData.MiningLevel}\` \n **Multi:** \`${skillsData.MiningMultipliers}%\``, inline: true},
                        { name: `🎣 Fishing:`, value: `**Level:** \`${skillsData.FishingLevel}\` \n **Exp:** \`${skillsData.FishingExp}/${100 * skillsData.FishingLevel}\` \n **Multi:** \`${skillsData.FishingMultipliers}%\``, inline: true},
                        { name: `🌾 Farming:`, value: `**Level:** \`${skillsData.FarmingLevel}\` \n **Exp:** \`${skillsData.FarmingExp}/${100 * skillsData.FarmingLevel}\` \n **Multi:** \`${skillsData.FarmingMultipliers}%\``, inline: true},
                    )
                    .setTimestamp()
                    .setFooter('📅');
        
                    message.channel.send(embed)
 
                }
            })
        } else return message.lineReplyNoMention(`You Or That User Does Not Have A Profile Yet!`);
    }
}
