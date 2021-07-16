
const inventorySchema = require("../models/inventory");
const profileSchema = require("../models/profile");

module.exports = {
    run: async (client, message, level) => {
        const prefix = await client.prefix(message)
        if(level == 3){
            await client.addItem(message.author.id, "mysterygift", 1)
            message.lineReply(`**The Doge God Has Sent You A Mystery Gift, You Can Use The \`${prefix}use mysterygift\` Command To Open It...**`)
        }
    }
}