const Discord = require("discord.js")
const error = require("../../utils/embed")
const Database = require("../../classes/Database")
const db = new Database()

exports.run = async (client, message, args) => {
  let text = args.join(" ")
  let splitOfText = text.split("/")
  let command = client.commands.get(splitOfText[0])
  if (command !== undefined) return message.channel.send(`${message.author} 명령어가 포함된 문장은 학습시킬 수 없습니다!`)
  if (splitOfText.length <= 1 || splitOfText[0] === "" || splitOfText[1] === "") {
    return error.invaildCommand(message, "!배워 학습 시킬 문장/답장할 내용")
  } else {
    db.get({ table: "learn_text", column: "*", where: `title = '${splitOfText[0]}'` }).then((result) => {
      if (result !== "None") return message.channel.send(`${message.author} 이미 존재하는 문장이에요!`)
      let filter = (reaction, user) => (reaction.emoji.name === "⭕" || reaction.emoji.name === "❌") && user.id === message.author.id
      let embed = new Discord.MessageEmbed()
        .setColor("#FF0000")
        .setTitle("문장을 학습시키지 전에 확인해주세요!")
        .setDescription("부적절한 어휘 및 노골적인 문장이 포함된 경우 \n관리자가 수동으로 삭제할 수 있으며 해당 유저를 제제할 수 있습니다.")
        .addField("학습 시킬 문장:", splitOfText[0])
        .addField("답장할 내용:", splitOfText[1])
        .setFooter("위 내용이 일치하다면 O 반응을 눌러주세요.")
      message.channel.send({ embed: embed }).then((th) => {
        th.react("⭕")
        th.react("❌")
        th.awaitReactions(filter, {
          max: 1,
        }).then((collected) => {
          if (collected.array()[0].emoji.name === "⭕") {
            db.add({
              table: "learn_text",
              column: "title, description, author, userId",
              value: `'${splitOfText[0]}', '${splitOfText[1]}', '${message.author.username}', '${message.author.id}'`,
            })
            th.delete()
            message.channel.send(`${message.author} 학습이 완료되었습니다!`)
          } else {
            th.delete()
            message.channel.send(`${message.author} 학습이 취소되었습니다..`)
          }
        })
      })
    })
  }
}

exports.config = {
  name: "배워",
  category: ["util"],
  des: ["입력한 내용을 학습합니다."],
  use: ["!배워 < 학습 시킬 문장 >/< 답장할 내용 >"],
}
