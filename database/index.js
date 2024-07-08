import { Sequelize } from "sequelize";
import db_config from '../config/db.config.js';
const sequelize = new Sequelize(db_config)
export default sequelize;