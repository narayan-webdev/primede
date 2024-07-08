
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Support_ticket = sequelize.define("Support_ticket", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(["OPEN", "CLOSED", "IN_PROGRESS", "ON_HOLD"]),
    allowNull: false
  },
});

Support_ticket.sync();
export default Support_ticket;