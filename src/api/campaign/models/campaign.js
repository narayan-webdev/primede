import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Campaign = sequelize.define("Campaign", {
  notification_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notification_body: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notification_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  schedule_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM("LINK", "PRODUCT", "COLLECTION"),
    allowNull: true,
  },
  web_notification: {
    type: DataTypes.BOOLEAN,
  },
  app_notification: {
    type: DataTypes.BOOLEAN,
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Campaign.sync();
export default Campaign;