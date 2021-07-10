const client = require('../main');
const profileSchema = require("../models/profile");

const profile = client.commands.get("profile")
const work = client.commands.get("work")

const wrongMsg = async (message, command, prefix) => {
    message.channel.send(`${message.author}, **That's Not The Correct Command! You Can Continute The Tutorial By Using The \`${prefix}${command}\`! \n Or, You Can End The Tutorial By Saying \`end\`!**`)
}

const checkEnd = async (message, data) => {
    if(message.content.toLowerCase() == "end"){
        data.Tutorial = "Done" 
        await data.save();

        message.lineReply(`**You Ended Your Tutorial!**`)
        return true
    } else return false
}

const phase = async (message, data, prefix) => {
    const end = await checkEnd(message, data)
    if(end == false){
        if(data.Tutorial == "1"){
            if(message.content == `${prefix}profile`){
                profile.run(client, message)

                message.lineReply(`**Good Job! Now, Income. You Can Earn Money By Using \`${prefix}work\`, \`${prefix}farm\`, \`${prefix}fish\`, \`${prefix}mine\`, etc \n\nTry Using \`${prefix}work\`! (Tip: You Can See A List Of Commands That Can Get You Money By Using The \`${prefix}help income\` Command!) \nYou Can End The Tutorial By Saying \`end\`!**`)
                
                data.Tutorial = "2"
                await data.save();

            } else wrongMsg(message, "profile", prefix)
        } else {
            if(data.Tutorial == "2"){
                if(message.content == `${prefix}work`){
                    work.run(client, message)
    
                    message.lineReply(`**Congratulations! You Finished The Tutorial! You Can Redo The Tutorial At Any Time! If You Still Need Help You Can Use The \`${prefix}help\` Command! \n\n(Creator: I know the tutorial is short, its still work in progress 😉)**`)
                    
                    data.Tutorial = "Done"
                    await data.save();
    
                } else wrongMsg(message, "work", prefix)
            }
        }
    }
}

module.exports = {
    run: async (client, message, args) => {
        const prefix = await client.prefix(message)

        profileSchema.findOne({ User: message.author.id }, async(err, data) => {
            if(data){
                if(data.Tutorial != "Done"){
                    phase(message, data, prefix)
                }
            } 
        })
    }
}