const { Client, Message, MessageEmbed } = require('discord.js');    
const { readdirSync } = require("fs");

const profileSchema = require("../../models/profile");

const helpCategories = () => {
    let categories = [];

    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.map((command) => {
        let file = require(`../../commands/${dir}/${command}`);

        if (!file.name) return "No command name.";

        let name = file.name.replace(".js", "");

        return `\`${name}\``;
      });

      let data = new Object();

      data = {
        name: dir,
        value: cmds.length === 0 ? "In progress." : cmds.join(" "),
      };

      categories.push(data);
    });

    return categories
}

const helpCommand = (client, cmd, prefix, message) => {

    const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find(
      (c) => c.aliases && c.aliases.includes(cmd.toLowerCase())
    );

    if(command){
        const embed = new MessageEmbed()
        .setTitle(`${prefix}${cmd}`)
        .addField(
          "COMMAND:",
          command.name ? `\`${command.name}\`` : "No name for this command."
        )
        .addField(
          "ALIASES:",
          command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "No aliases for this command."
        )
        .addField(
          "USAGE:",
          command.usage
            ? `\`${prefix}${command.usage}\``
            : `\`${prefix}${command.name}\``
        )
        .addField(
          "DESCRIPTION:",
          command.description
            ? command.description
            : "No description for this command."
        )
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(`#fcdb03`);
    
        message.channel.send(embed);

        return true
    } else {
        return false
    }
}

module.exports = {
    name : 'help',
    cooldown: 1,
    category : 'info',
    usage: `help {category || command}`,
    description : `Returns a list of commands!`,
    run: async (client, message, args) => {
        const emoji = await client.dgemoji()
        const prefix = await client.prefix(message)

        if(args[0]){
            const categories = helpCategories()
            const category = categories.find(key => key.name.toLowerCase() && key.name.includes(args[0].toLowerCase()));
            if(category){
                var showName

                const cName = category.name
                const cCommands = category.value

                if(cName == "economy"){
                    showName = `${emoji} Economy`
                } else if(cName == "income"){
                    showName = `📈 Income`
                } else if(cName == "info"){
                    showName = `🤔 Info`
                } else if(cName == "items"){
                    showName = `🎈 Items`
                } else if(cName == "utility"){
                  showName = `🔧 Utility`
                } else if(cName == "computer"){
                  showName = `💻 Computer`
                }

                const embed = new MessageEmbed()
                .setColor('#fcdb03')
                .setAuthor(`${prefix}help ${cName}`)
                .setDescription(`**${showName}:** \n ${cCommands}`)
                .setTimestamp()
                .setFooter('📅');
                
                message.channel.send(embed)
            } else {
                const helpcmd = helpCommand(client, args[0], prefix, message)
                if(!helpcmd){
                    const embed = new MessageEmbed()
                    .setColor('#fcdb03')
                    .setAuthor(`Doge Coin Help`, message.member.user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: `${emoji} Economy`, value: `\`${prefix}help economy\``, inline: true},
                        { name: `📈 Income`, value: `\`${prefix}help income\``, inline: true},
                        { name: `🤔 Info`, value: `\`${prefix}help info\``, inline: true},
                        { name: `🎈 Items`, value: `\`${prefix}help items\``, inline: true},
                        { name: `🔧 Utility`, value: `\`${prefix}help utility\``, inline: true},
                        { name: `💻 Computer`, value: `\`${prefix}help computer\``, inline: true},
                    )
                    .setTimestamp()
                    .setFooter('📅');
                    
                    message.channel.send(embed)
                }
            }
        } else {
            const embed = new MessageEmbed()
            .setColor('#fcdb03')
            .setAuthor(`Doge Coin Help`, message.member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `${emoji} Economy`, value: `\`${prefix}help economy\``, inline: true},
                { name: `📈 Income`, value: `\`${prefix}help income\``, inline: true},
                { name: `🤔 Info`, value: `\`${prefix}help info\``, inline: true},
                { name: `🎈 Items`, value: `\`${prefix}help items\``, inline: true},
                { name: `🔧 Utility`, value: `\`${prefix}help utility\``, inline: true},
                { name: `💻 Computer`, value: `\`${prefix}help computer\``, inline: true},
            )
            .setTimestamp()
            .setFooter('📅');
            
            message.channel.send(embed)
        }
    }
}
