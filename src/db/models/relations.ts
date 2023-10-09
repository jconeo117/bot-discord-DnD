import { Character } from './characters'
import { User } from './user'
import { Session } from './sessions'
import { Skill } from './skills'

Character.belongsTo(User, { foreignKey: 'userId', as: 'user', targetKey: 'id' })
Skill.belongsTo(Character, {
  foreignKey: 'characterId',
  as: 'character',
  targetKey: 'id',
})

User.hasMany(Character, { as: 'characters', foreignKey: 'userId' })
Character.hasMany(Skill, { as: 'skills', foreignKey: 'characterId' })

Session.belongsTo(User, {
  as: 'gameMaster',
  foreignKey: 'gameMasterId',
})

// Relación muchos-a-muchos con usuarios (jugadores)
Session.belongsToMany(User, {
  through: 'SessionUser',
  as: 'players',
  uniqueKey: 'session_user',
})

// Relación muchos-a-muchos con personajes
Session.belongsToMany(Character, {
  through: 'SessionCharacter',
  as: 'characters',
})

// Define las relaciones inversas en los modelos User y Character si es necesario
User.belongsToMany(Session, {
  through: 'SessionUser',
  as: 'sessions',
  onDelete: 'cascade',
})

Character.belongsToMany(Session, {
  through: 'SessionCharacter',
  as: 'sessions',
  onDelete: 'cascade',
})
