const Database = require("../../classes/Database")
const db = new Database()
const config = require("../../config.json")

exports.run = async (_, message) => {
  if (config.owners.some((word) => message.author.id.includes(word))) {
    db.get({ table: "learn_text", column: "*" }).then((result) => {
      for (const item of result) {
        if (item.title === undefined) break
        console.log(`
학습 문장: ${item.title}
답장 내용: ${item.description}
작성자 : ${item.author} ( ${item.userId} )\n`)
      }
      message.channel.send(`${message.author} 콘솔에 리스트를 출력하였습니다!`)
    })
  } else {
    message.channel.send(`${message.author} 봇 관리자만 가능한 명령어입니다.`)
  }
}

exports.config = {
  name: "뱉어",
  category: ["owner"],
  des: ["배운 문장을 모두 전송합니다."],
  use: ["!뱉어"],
}
