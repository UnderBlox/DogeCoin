const client = require('../main')

const Discord = require('discord.js');

const cooldownsSchema = require("../models/cooldowns");
const profileSchema = require("../models/profile");

const tutorialFunction = require("../functions/tutorial");

function secondsToHms(d) {
    if(!d < 1) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? "h" : "h") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? "m" : "m") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
        return hDisplay + mDisplay + sDisplay; 
    }
}

function checkTutorial(message) {
    profileSchema.findOne({ User: message.author.id }, async(err, data) => {
        if(data){
            if(data.Tutorial == "Done"){
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    })
}

client.on('message', async message =>{
    if(message.author.bot) return;

    var tutorial = false

    const data = await profileSchema.findOne({ User: message.author.id })

    if(data){
        if(data.Tutorial == "Done"){
            tutorial = false
        } else {
            tutorial = true
        }
    } else {
        tutorial = false
    }

    if(tutorial == false){

        const p = await client.prefix(message)
        if(message.mentions.users.first()) {
            if(message.mentions.users.first().id === client.user.id) return message.channel.send(`Prefix in ${message.guild.name} is **${p}**`)
        }
    
        if(!message.content.startsWith(p)) return;
    
        if(!message.guild) return;
        if(!message.member) message.member = await message.guild.fetchMember(message);
    
        const args = message.content.slice(p.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
    
        if(cmd.length == 0) return;
    
        let command = client.commands.get(cmd)
    
        if(!command) command = client.commands.get(client.aliases.get(cmd));
    
        if(command) {
            cooldownsSchema.findOne({ User: message.author.id }, async(err, data) => {
                if(!data){
                    const map = new Map()
    
                    const current_time = Date.now();
    
                    map.set(command.name, current_time, new Discord.Collection());
    
                    new cooldownsSchema({
                        User: message.author.id,
                        Cooldown: map
                    }).save();
    
                    command.run(client, message, args) 
                } else {
    
                    const current_time = Date.now();
    
                    const cooldown_amount = (command.cooldown) * 1000;
                    const expiration_time = data.Cooldown.get(command.name) + cooldown_amount;
    
                    if(current_time < expiration_time){
    
                        if(!data.Cooldown.has(command.name)){
                            data.Cooldown.set(command.name ,current_time, new Discord.Collection());
                            await data.save()
                        }
    
                        const time_left = (expiration_time - current_time) / 1000;
                        var showTimeLeft = secondsToHms(time_left)
            
                        if(showTimeLeft){
                            const embed = new Discord.MessageEmbed()
                            .setColor('#f54e42')
                            .setTitle('Slow Down...')
                            .setDescription(`Please Wait **${showTimeLeft}** Before Using \`${command.name}\`, **${message.author.username}**! \n The \`${command.name}\` Command Has A Default Cooldown Of \`${secondsToHms(command.cooldown)}\` Before You Can Use It Again!`)
                            .setTimestamp()
                            .setFooter('📅')  
            
                            return message.channel.send(embed);
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setColor('#f54e42')
                            .setTitle('Slow Down...')
                            .setDescription(`Please Wait **${time_left.toFixed(1)} Seconds** Before Using \`${command.name}\`, **${message.author.username}**! \n The \`${command.name}\` Command Has A Default Cooldown Of \`${command.cooldown}s\` Before You Can Use It Again!`)
                            .setTimestamp()
                            .setFooter('📅')    
        
                            return message.channel.send(embed);
                        }
                    } else {
                        const current_time = Date.now();
            
                        data.Cooldown.set(command.name, current_time, new Discord.Collection());
                        await data.save();
    
                        try {
                            command.run(client, message, args) 
                        } catch (e) {
                            const embed = new Discord.MessageEmbed()
                            .setColor('#f54e42')
                            .setTitle('Error!')
                            .setDescription(`There Was An Error While Executing That Command! ${e}`)
                    
                            message.author.send(embed);
                        }
                    }
                }
            })  
        }

    } else tutorialFunction.run(client, message)
})