const {Collection, Client, Discord} = require('discord.js');
require('discord-reply');
const fs = require('fs');

const keepAlive = require("./server");
const schedule = require("./schedule");

const client = new Client({
    shards: "auto",
    restTimeOffset: 0,
    disableEveryone: true
});

const profileSchema = require("./models/profile");
const skillsSchema = require("./models/skills");
const cooldownSchema = require("./models/cooldowns");
const invSchema = require("./models/inventory");
const prefixSchema = require('./models/prefix');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Re_Playz:LOL251530@dogecoindb.3iolr.mongodb.net/Data', {
    useFindAndModify: false,
    useUnifiedTopology : true,
    useNewUrlParser : true,
}).then(console.log("Connected To MongoDB!"));

mongoose.set('useFindAndModify', false);

const additionalMessages = require("./details/additionalMsg");

const items = require("./items/items");

const levelrewards = require('./functions/levelrewards');

const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

module.exports = client;

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

schedule.run(client)

//functions
client.prefix = async function(message) {
    let custom;

    const data = await prefixSchema.findOne({ Guild : message.guild.id })
        .catch(err => console.log(err))
    
    if(data) {
        custom = data.Prefix;
    } else {
        custom = prefix;
    }

    return custom;
};

client.dgemoji = async function() {
    return "<:Dogecoin_Logo:860033532327231488>";
};

const LevelNames = {
    Mine: "MiningLevel",
    Fish: "FishingLevel",
    Farm: "FarmingLevel"
}

const ExpNames = {
    Mine: "MiningExp",
    Fish: "FishingExp",
    Farm: "FarmingExp"
}

const MultiNames = {
    Mine: "MiningMultipliers",
    Fish: "FishingMultipliers",
    Farm: "FarmingMultipliers"
}

const DogeRanks = {
   5: "<:Doge:860451620574593025> Doge",
   10: "<:SmugDoge:861055047924318218> Smug Doge",
   25: "<a:DancingDoge:861054037003993138> Dancin' Doge",
   50: "<:SmallDripDoge:861055047717617694> Drip Doge"
}

client.addExp = async (message, exp, skill) => {
    if(!skill){
        profileSchema.findOne({ User: message.author.id }, async(err, data) => {
            if(data){
                data.Exp = data.Exp + exp;
                await data.save();
    
                const requiredExpLevelUp = 100 * data.Level
    
                if(data.Exp > requiredExpLevelUp){
                    data.Level = data.Level + 1
    
                    const ExpLeft = data.Exp - requiredExpLevelUp
                    data.Exp = ExpLeft
                    data.Multipliers = data.Multipliers + data.Level

                    const rank = DogeRanks[data.Level]
                    if(rank){
                        data.Rank = rank
                    }
    
                    await data.save();

                    levelrewards.run(client, message, data.Level)
    
                    message.lineReply(`<:Report:860322443477778432> **Breaking News! Doge Coin Prices Has Increased By ${data.Level}%!** <a:DogeBall:860321981777969183>`)
                }
            }
        })
    } else {
        skillsSchema.findOne({ User: message.author.id }, async(err, data) => {
            if(data){
                var Level = LevelNames[skill]
                var Exp = ExpNames[skill]
                var Multi = MultiNames[skill]

                data[Exp] = data[Exp] + exp;
                await data.save();
    
                const requiredExpLevelUp = 100 * data[Level]
    
                if(data[Exp] > requiredExpLevelUp){
                    data[Level] = data[Level] + 1
    
                    const ExpLeft = data[Exp] - requiredExpLevelUp
                    data[Exp] = ExpLeft
                    data[Multi] = data[Multi] + data[Level]
    
                    await data.save();

                    levelrewards.run(client, message, data.Level)
    
                    message.lineReply(`<:Report:860322443477778432> **Breaking News! ${skill}(ing) Doge Coins Income Has Increased By ${data[Level]}%!** <a:DogeBall:860321981777969183>`)
                }
            }
        })
    }
}

client.addItem = async (id, itemId, amount) => {
    const invData = await invSchema.findOne({ User: id });
    if(invData){
        const item = items.find(key => itemId.toLowerCase() && key.IDs.includes(itemId.toLowerCase()));
        if(item){
            const hasItem = Object.keys(invData.Inventory).includes(item.Name);
            if(hasItem){
                invData.Inventory[item.Name] = invData.Inventory[item.Name] + amount
                await invSchema.findOneAndUpdate({ User: id }, invData)
            } else {
                invData.Inventory[item.Name] = amount
                await invSchema.findOneAndUpdate({ User: id }, invData)
            }
        }
    } else {
        const item = items.find(key => itemId.toLowerCase() && key.IDs.includes(itemId.toLowerCase()));
        if(item){
            new invSchema({
                User: id,
                Inventory: {[item.Name]: amount },
            }).save();
        }
    }
}

client.rmvItem = async (id, itemId, amount) => {
    const invData = await invSchema.findOne({ User: id });
    if(invData){
        const item = items.find(key => itemId.toLowerCase() && key.IDs.includes(itemId.toLowerCase()));
        if(item){
            const hasItem = Object.keys(invData.Inventory).includes(item.Name);
            if(hasItem){
                invData.Inventory[item.Name] = invData.Inventory[item.Name] - amount
                await invSchema.findOneAndUpdate({ User: id }, invData)
            } else {
                invData.Inventory[item.Name] = -amount
                await invSchema.findOneAndUpdate({ User: id }, invData)
            }
        }
    } else {
        const item = items.find(key => itemId.toLowerCase() && key.IDs.includes(itemId.toLowerCase()));
        if(item){
            new invSchema({
                User: id,
                Inventory: {[item.Name]: -amount },
            }).save();
        }
    }
}

client.rmvCooldown = async (id, cmdName, time) => {
    cooldownSchema.findOne({ User: id }, async(err, data) => {
        if(data){
            try{
                const cooldowns = data.Cooldown
                const cmdCooldown = cooldowns.get(cmdName)
                const newTime = cmdCooldown - time * 1000
                cooldowns.set(cmdName, newTime)
                await data.save();
            } catch(e){
                throw e
            }
        }
    })
}

client.bal = (id) => new Promise(async ful => {
    const data = await profileSchema.findOne({ User: id });
    if(!data) return ful(false);
    ful(data.DogeCoins);
});

client.add = async (id, coins) => {
    profileSchema.findOne({ User: id }, async(err, data) => {
        if(err) throw err;
        if(data) {
            data.DogeCoins += coins;
            await data.save();
            return true
        } else {
            return false;
        }
    })
};

client.rmv = async (id, coins) => {
    profileSchema.findOne({ User: id }, async(err, data) => {
        if(err) throw err;
        if(data) {
            data.DogeCoins -= coins;
            await data.save();
            return true;
        } else {
            return false;
        }
    })
};

client.sendAddMsg = (message) => {
    const ranNum = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    if(ranNum == 10){
        const msg = additionalMessages[Math.floor(Math.random() * additionalMessages.length)];
        message.reply(`**${msg}**`);
    }
}

keepAlive();
client.login(token);