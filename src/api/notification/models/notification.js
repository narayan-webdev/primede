
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Notification = sequelize.define("Notification", {
  title: {
    type: DataTypes.STRING,
  },
  desctiption: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.ENUM("PRODUCT", "COLLECTION", "ORDER", "SUBSCRIPTION", "PROMOTION", "INFORMATION", "TRANSACTION"),
  },
  isRead: {
    type: DataTypes.BOOLEAN,
  },
  data: {
    type: DataTypes.STRING,
  },
});

Notification.sync();
export default Notification;