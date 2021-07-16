const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name : 'updates',
    cooldown: 3,
    category : 'info',
    description : `Get To Know What's New After The Update!`,
    run: async (client, message, args) => {
        const update001 = `**━━━__Update 0.0.1__━━━**\n__Added Computer__\n‣ Auto Mines Doge Coins Every Hour \n‣ Upgrades\n\n__Fixed Profile Command Bug__\n‣ When Checking Other Member's Profile, It Will Show The Message Author's Skill Data Rather Than The Targeted Member\n\n‣ Added Update Command\n‣ Added Level Rewards\n‣ Revamped Use Command\n‣ Deleted All Fun Facts But Added More Tips\n\n**SORRY FOR THE DATA WIPE!**`
        message.channel.send(update001)
    }
}
