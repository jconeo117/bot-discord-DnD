import { Client, Message } from "discord.js"

export const run = async (client:Client, message: Message, args:string[])=>{

  console.log(args)
  message.channel.send('PONG MALDITA SEA')

}


export const help = {
  name:'ping',
  description:'comando de prueba',
  usage:'!ping'
}