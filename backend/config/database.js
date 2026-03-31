import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import SessionModel from '../models/Session.js';
import MessageModel from '../models/Message.js';



dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'codify_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Session = SessionModel(sequelize, Sequelize);
db.Message = MessageModel(sequelize, Sequelize);


// DEBUG
console.log("User:", db.User);
console.log("Session:", db.Session);
console.log("Message:", db.Message);

db.Session.hasMany(db.Message, { as: 'messages', foreignKey: 'sessionId' });
db.Message.belongsTo(db.Session, { foreignKey: 'sessionId' });

export default db;