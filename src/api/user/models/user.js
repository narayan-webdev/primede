import { DataTypes } from "sequelize";
import sequelize from '../../../../database/index.js';
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Unknown"
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Unknown"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  country_code: {
    type: DataTypes.STRING,
    defaultValue: "+91",
  },
  wallet_balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  password_reset_token: {
    type: DataTypes.STRING,
  },
  FCM_app_token: {
    type: DataTypes.STRING,
  },
  FCM_web_token: {
    type: DataTypes.STRING,
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otp_expiration: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subdomain: {
    type: DataTypes.STRING,
  }
});

User.sync();
export default User;