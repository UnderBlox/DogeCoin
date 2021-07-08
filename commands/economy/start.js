const { Client, Message, MessageEmbed } = require('discord.js');

const client = require('../../main');
const profileSchema = require("../../models/profile");
const skillsSchema = require("../../models/skills");

module.exports = {
    name : 'start',
    cooldown: 1,
    category : 'economy',
    description : `Start Your Adventure On Being The Richest DogeCoin Owner!`,
    run: async (client, message, args) => {
        const prefix = await client.prefix(message)
        profileSchema.findOne({ User: message.author.id }, async(err, data) => {
            if(!data){
                new profileSchema({
                    User: message.author.id,
                    Rank: "<:SmolDoge:861053251353051156> Smol Doge",
                    DogeCoins: 0,
                    Multipliers: 0,
                    Level: 1,
                    Exp: 0,
                    DailyStreak: 0,
                }).save();

                new skillsSchema({
                    User: message.author.id,

                    MiningLevel: 1,
                    MiningExp: 0,
                    MiningMultipliers: 1,

                    FishingLevel: 1,
                    FishingExp: 0,
                    FishingMultipliers: 1,

                    FarmingLevel: 1,
                    FarmingExp: 0,
                    FarmingMultipliers: 1,
                }).save();

                message.channel.send(`👋 ${message.author}, **New To DogeCoin? You Can Learn How To Play By Using The \`${prefix}tutorial\` Command!**`)
            }
        })
    }
}
