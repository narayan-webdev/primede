import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Address = sequelize.define("Address", {
  name: {
    type: DataTypes.STRING
  },
  houseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLine1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "+91",
  },
  phone: {
    type: DataTypes.STRING,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  addressLine2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Address.sync();
export default Address;