import { Message } from 'discord.js'
import { Session } from '../../db/models/sessions'
import { User } from '../../db/models/user'
// import { User, Session } from '../db/models'


export const startSession = async (
  message: Message,
  session: Session,
  user: User
) => {
  if (!session) {
    await message.channel.send('No hay ninguna sesion activa/disponible')
    return
  }

  if (user.id !== session.dataValues.gameMasterId) {
    await message.channel.send('Solo el Game Master puede iniciar la sesion')
    return
  }

  session.isStarted = true
  await session.save()
  // setInterval(() => {
  //   message.delete()
  // }, 1000)

  await message.channel.send(`La sesion: **${session.name}** ha comenzado`)

  setInterval(() => {
    message.channel.lastMessage?.delete()
  }, 2000)
}
