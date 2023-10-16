import { Message } from 'discord.js'
import { Session } from '../../db/models/sessions'
import { User } from '../../db/models/user'



export const finishSession = async (
  message: Message,
  session: Session,
  user: User
) => {
  if (!session) {
    await message.channel.send('No hay ninguna sesion activa/disponible')
    return
  }

  if (!session.isStarted) {
    await message.channel.send(
      `La sesion: **${session.name}** aun no ha comenzado`
    )
    setInterval(() => {
      message.channel.lastMessage?.delete()
    }, 2000)
    return
  }

  if (user.id !== session.dataValues.gameMasterId) {
    await message.channel.send('Solo el Game Master puede finalizar la sesion')
    return
  }

  session.isFinished = true
  await session.save()

  await message.channel.send(`La sesion: **${session.name}** ha finalizado`)
  setTimeout(() => {
    message.channel.lastMessage?.delete()
  }, 2000)
}
