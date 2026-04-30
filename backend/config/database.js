import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import UserModel from '../models/User.js';
import SessionModel from '../models/Session.js';
import MessageModel from '../models/Message.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../.env') });

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'codify_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
      }
    );

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize, Sequelize);
db.Session = SessionModel(sequelize, Sequelize);
db.Message = MessageModel(sequelize, Sequelize);

db.User.hasMany(db.Session, { as: 'sessions', foreignKey: 'userId' });
db.Session.belongsTo(db.User, { as: 'user', foreignKey: 'userId' });
db.Session.hasMany(db.Message, { as: 'messages', foreignKey: 'sessionId' });
db.Message.belongsTo(db.Session, { foreignKey: 'sessionId' });

export default db;