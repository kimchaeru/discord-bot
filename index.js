const Discord = require("discord.js")
const ListOfIntent = new Discord.Intents(["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"])
const client = new Discord.Client({ ws: ListOfIntent })
const prefix = '!'
const token = process.env.token;
const fs = require("fs")
const Database = require("./classes/Database")
const db = new Database()

client.commands = new Discord.Collection()
client.category = ["util", "owner"]

fs.readdirSync("./commands").forEach((dir) => {
  const filter = fs.readdirSync(`./commands/${dir}`).filter((f) => f.endsWith(".js"))
  filter.forEach((file) => {
    const cmd = require(`./commands/${dir}/${file}`)
    client.commands.set(cmd.config.name, cmd)
  })
})

function runCommand(command, message, args, prefix) {
  if (client.commands.get(command)) {
    const cmd = client.commands.get(command)
    if (cmd) cmd.run(client, message, args, prefix)
    return
  }
}

client.on("ready", () => {
  console.log("Bot is ready!")
})


client.on("message", async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  let args = message.content.slice(prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()
  let _cmd = client.commands.get(command)
  if (_cmd === undefined) {
    db.get({ table: "learn_text", column: "*", where: `title = '${message.content.slice(1)}'` }).then((result) => {
      if (result[0].author === undefined) return
      message.channel.send(`${result[0].description}\n\`${result[0].author}님이 알려주셨어요!\``)
    })
  }
  try {
    runCommand(command, message, args, prefix)
  } catch (_) {
    console.error(_)
  }
})

client.login(token)
