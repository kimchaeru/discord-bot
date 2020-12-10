const Discord = require("discord.js")
const error = require("../../utils/embed")
const Database = require("../../classes/Database")
const db = new Database()

exports.run = async (_, message, args) => {
  let text = args.join(" ")
  if (text === "") {
    return error.invaildCommand(message, "!지워 학습 시킨 문장")
  } else {
    db.get({ table: "learn_text", column: "*", where: `title = '${text}'` }).then((result) => {
      if (result === "None") return message.channel.send(`${message.author} 존재하지 않은 문장이에요!`)
      if (result[0].userId !== message.author.id) return message.channel.send(`${message.author} 본인이 학습한 문장만 지울 수 있습니다!`)
      let filter = (reaction, user) => (reaction.emoji.name === "⭕" || reaction.emoji.name === "❌") && user.id === message.author.id
      let embed = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setTitle("정말로 해당 문장을 지우시겠어요?")
        .addField("학습 시켰던 문장:", result[0].title)
        .addField("답장 내용:", result[0].description)
        .setFooter("정말로 삭제하실꺼라면 O 반응을 눌러주세요.")
      message.channel.send({ embed: embed }).then((th) => {
        th.react("⭕")
        th.react("❌")
        th.awaitReactions(filter, {
          max: 1,
        }).then((collected) => {
          if (collected.array()[0].emoji.name === "⭕") {
            db.remove({ table: "learn_text", where: `title = '${text}'` })
            th.delete()
            message.channel.send(`${message.author} 삭제가 완료되었습니다!`)
          } else {
            th.delete()
            message.channel.send(`${message.author} 삭제가 취소되었습니다..`)
          }
        })
      })
    })
  }
}

exports.config = {
  name: "잊어",
  category: ["util"],
  des: ["학습한 내용을 지웁니다."],
  use: ["!잊어 < 지울 문장 >"],
}
