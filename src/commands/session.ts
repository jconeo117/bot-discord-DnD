import {
  Client,
  EmbedBuilder,
  Message,
} from 'discord.js'
import { initsesion } from '../utils/session/initsesion'
import { joinsesion } from '../utils/session/joinsesion'
import { startSession } from '../utils/session/startsesion'
import { finishSession } from '../utils/session/finishsesion'
// import { Session, Character, User } from '../db/models'

import { Session } from '../db/models/sessions'
import { Character } from '../db/models/characters'
import { User } from '../db/models/user'

const embed = new EmbedBuilder()
var description: string = ''
const GameMaster = async () =>
  await User.findOne({ where: { name: 'jconeo117' } })

var msg: {reply:Message<false> | Message<true> ; description: string} | undefined

export async function run(
  client: Client,
  message: Message,
  args: string[],
  command: string
) {
  const GM = await GameMaster()
  const user = await User.findOne({ where: { name: message.author.username } })

  const activeSesion = await Session.findOne({
    where: { isFinished: false },
  })
  const sesionName = args.join(' ')

  if (command === 'initsesion') {
    if (!args[0]) {
      const cmd = help.usage.find((usage) => usage.startsWith(`!${command}`))
      await message.reply(`Uso: ${cmd}`)
      return
    }

    if (activeSesion) {
      await message.channel.send('Ya hay una sesion activa.')
      return
    }

    msg = await initsesion(embed, message, description, sesionName, GM)

    return
  } else if (command === 'joinsesion') {
    const userCharacters = await Character.findAll({
      where: { userId: user?.id },
    })

    if (activeSesion?.isStarted) {
      await message.reply('No hay una sesion disponible para unirte')
      return
    }

    if (!userCharacters) {
      await message.reply(
        'No tienes personajes para entrar en la sesion. usa !createchar para crear uno nuevo. '
      )
      return
    }

    await joinsesion(
      client,
      embed,
      message,
      userCharacters,
      activeSesion as Session,
      user as User,
      msg
    ).then(()=>{
      message.delete()
    })


  } else if (command === 'startsesion') {
    await startSession(message, activeSesion as Session, user as User).then(() => {message.delete()})
  } else if (command === 'finishsesion') {
    await finishSession(message, activeSesion as Session, user as User).then(()=> {message.delete()})
  }
}

export const help = {
  name: ['initsesion', 'joinsesion', 'startsesion', 'finishsesion'],
  descripcion: 'comando para crear/unirse/iniciar una sesion',
  usage: [
    '!initsesion [Nomebre]',
    '!joinsesion',
    '!startsesion',
    '!finishsesion',
  ],
}
