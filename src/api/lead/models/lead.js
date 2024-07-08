import { DataTypes } from "sequelize";
import sequelize from '../../../../database/index.js';
const Lead = sequelize.define("Lead", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country_code: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "+91"
  },
  status: {
    type: DataTypes.ENUM(
      "OPEN",
      "UNDER_CONNECTION",
      "FOLLOWUP",
      "ON_HOLD",
      "CANCELLED",
      "COMPLETED",
      "COMFIRMED",
    ),
    defaultValue: "OPEN"
  },
  source: {
    type: DataTypes.ENUM(
      "WHATSAPP",
      "INSTAGRAM",
      "YOUTUBE_CHANNEL",
      "APP",
      "WEBSITE"
    ),
  },
  type: {
    type: DataTypes.ENUM(
      "HOT_LEAD",
      "WARM_LEAD",
      "COLD_LEAD",
      "NOT_CONNECTED",
    ),
  },
  consumer_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  staff_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Lead.sync();
export default Lead;
