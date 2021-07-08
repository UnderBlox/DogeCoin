const { Client, Message, MessageEmbed, Collection } = require('discord.js');

const client = require('../../main');
const profileSchema = require("../../models/profile");

module.exports = {
    name : 'leaderboard',
    cooldown: 1,
    aliases : ['lb', 'richest', 'rich'],
    category : 'economy',
    description : `Start Your Adventure On Being The Richest DogeCoin Owner!`,
    run: async (client, message, args) => {
        const prefix = await client.prefix(message)
        const data = await profileSchema.findOne({ User: message.author.id });
        if(data){
            const emoji = await client.dgemoji()
        
            const collection = new Collection();
            
            await Promise.all(
                message.guild.members.cache.map(async (member) => {
                    const id = member.id;
                    const bal = await client.bal(id);
                    return bal !== false
                        ? collection.set(id, {
                            id,
                            bal,
                        })
                        : null;
                })
            );
    
            const placeEmojis = [
                `🥇`,
                `🥈`,
                `🥉`
            ]
    
            const data = collection.sort((a, b) => b.bal - a.bal).first(10);
    
            message.channel.send(
                new MessageEmbed()
                    .setAuthor(`Richest DogeCoin Owners In ${message.guild.name}`, message.member.user.displayAvatarURL({ dynamic: true }))
                    .setColor('#fcdb03')
                    .setDescription(
                        data.map((v, i) => {
                            const placeEmoji = placeEmojis[i]
                            if(placeEmoji){
                                return `${placeEmoji} **${client.users.cache.get(v.id).tag}** — ${emoji} ${v.bal}`
                            } else {
                                return `🏅 **${client.users.cache.get(v.id).tag}** — ${emoji} ${v.bal}`
                            }
                        })
                    )
                    .setTimestamp()
                    .setFooter('📅')
            )
        } else return message.reply(`You Don't Have A DogeCoin Profile, You Can Start One By Using \`${await client.prefix(message)}start\`!`)
    }
}
