exports.run = async (client, message) => {
  message.channel.send("측정 중 입니다...").then((msg) => {
    msg.edit(`Pong! 현재 핑은 \`${client.ws.ping}ms\` 입니다!`)
  })
}

exports.config = {
  name: "핑",
  category: ["util"],
  des: ["봇의 디스코드 웹소켓 지연시간을 알려드립니다."],
  use: ["!핑"],
}
