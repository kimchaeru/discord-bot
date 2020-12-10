const Discord = require("discord.js")
const { prefix } = require("../../config.json")

exports.run = async (client, message, args) => {
  if (!args[0]) {
    const categorys = client.category
    let Commands = new Discord.MessageEmbed()
      .setAuthor(client.user.username + " 명령어", client.user.displayAvatarURL())
      .setTitle("실 사용 때 < >는 지워주셔야합니다.")
      .setColor("#FF0000")
      .setFooter(`${prefix}도움말 < 명령어 > 를 통하여 해당 명령어를 자세히 확인해보세요.`)
    for (const category of categorys) {
      Commands.addField(
        category,
        `> **\`${client.commands
          .filter((el) => el.config.category == category)
          .keyArray()
          .join("`, `")}\`**`
      )
    }
    message.reply(Commands)
  } else {
    if (client.commands.get(args[0])) {
      var command = client.commands.get(args[0])
    } else return message.reply(`${args[0]} 명령어라는 것을 찾을 수 없어요...`)

    let config = command.config
    let name = config.name
    let category = config.category
    let description = config.des
    let use = config.use

    let Command = new Discord.MessageEmbed()
      .setTitle(`${name} 명령어`)
      .setColor("#FF0000")
      .setDescription(`\`\`\`fix\n사용법: ${use}\`\`\``)
      .addField("명령어 설명", `**${description}**`, false)
      .addField("카테고리", `**${category}**`, true)
    message.reply(Command)
  }
}

exports.config = {
  name: "도움말",
  category: ["util"],
  des: ["봇에 대한 명령어 리스트들을 불러와드립니다."],
  use: ["!도움말 < 명령어 >"],
}
