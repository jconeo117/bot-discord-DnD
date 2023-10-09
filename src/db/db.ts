import { Sequelize } from "sequelize";


export const db = new Sequelize({
  logging: false,
  dialect:'sqlite',
  storage:'./botDB.db'
})



// Character.belongsTo(User,{foreignKey:'userId'})