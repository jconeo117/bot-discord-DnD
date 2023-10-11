import { Client, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Character } from "../db/models/characters";
import { User } from "../db/models/user";

export async function run(client:Client,message:Message, args:string[], command:string) {

  const user = await User.findOne({where:{name:message.author.username}})
  const characters = await user?.getCharacters()
  
  console.log(characters)

  await message.channel.send('Probando')
  const menu = new StringSelectMenuBuilder()
  .setCustomId('select_char')
  .setPlaceholder('Selecciona el personaje')

  const options = new StringSelectMenuOptionBuilder()


  const embed = new EmbedBuilder()

}


export const help ={
  name:'shop-skill',
  descricion:'comando para comprar crear/comprar habilidades/invocaciones',
  usage:'!shop-skill'
}