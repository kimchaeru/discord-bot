const Discord = require("discord.js")
const config = require("../../config.json")
const Database = require("../../classes/Database")
const db = new Database()

exports.run = async (client, message, args) => {
  if (config.owners.some((word) => message.author.id.includes(word))) {
    let shutdown = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL()).setTitle("오류").setDescription("잘못된 클라이언트 종료 방식입니다.").setColor("RED")

    let text = args.join(" ")
    if (text === "") return message.reply("실행할 구문을 적어주세요!")

    if (text.indexOf("exit") != -1 && text.indexOf("process") != -1) {
      return message.channel.send(shutdown)
    } else {
      const result = new Promise((resolve) => resolve(eval(text)))
      return result
        .then((output) => {
          if (typeof output !== "string")
            output = require("util").inspect(output, {
              depth: 0,
            })

          if (output.includes(client.token)) output = output.replace(client.token, "토큰")
          if (output.length > 1010) output = output.slice(0, 1010) + "\n..."

          let embed = new Discord.MessageEmbed().setColor("#5fe9ff").setDescription("입력 :\n```js\n" + text + "\n```\n출력 :```js\n" + output + "\n```")
          message.channel.send({ embed: embed })
        })
        .catch((error) => {
          error = error.toString()
          error = error.replace(client.token, "토큰")

          if (error.includes(client.token)) error = error.replace(client.token, "토큰")

          let embed = new Discord.MessageEmbed().setAuthor(message.author.username, message.author.avatarURL()).setTitle("오류").setDescription(error).setColor("RED")
          message.channel.send({ embed: embed })
        })
    }
  } else {
    return message.channel.send(`${message.author} 봇 관리자만 가능한 명령어입니다.`)
  }
}

exports.config = {
  name: "실행",
  category: ["owner"],
  des: ["입력한 구문을 실행합니다."],
  use: ["!실행"],
}
