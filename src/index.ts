import { Client, GatewayIntentBits, Message, Partials } from "discord.js";
import { config } from "./config";
import { commandLoader } from "./utils/commandLoader";
import { db } from "./db/db";
// import { User } from "./db/models/Users";
// import { User } from "./db/models";
import { User } from "./db/models/user";
import { Character } from "./db/models/characters";
import { Session } from "./db/models/sessions";
import { Skill } from "./db/models/skills";
import '../src/db/models/relations'

const client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
      'Guilds',
      'GuildMembers',
      'GuildMessages',
      'MessageContent'
  ],
  partials:[ Partials.Channel]
});

db.authenticate()
.then(()=>{
  console.log('Conexion a la DB Sqlite exitosa!!')
})
.catch((error: typeof Error)=>{
  console.log('error al conectarse a la DB', error)
})


// db.sync({force: true})
// db.sync({alter:true})
db.sync()
client.on('ready', ()=>{
  console.log(`Bot ${client.user?.tag} is ready`)
})

client.on('messageCreate', async (message: Message)=>{

  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase() as string;

  var new_user = await User.findOne({where:{name: message.author.username}})

  if(!new_user){
    new_user = await User.create({name:message.author.username})
  }

  await commandLoader(client, message, command, args)

})


client.login(config.Token)

export {User, Session, Character, Skill}