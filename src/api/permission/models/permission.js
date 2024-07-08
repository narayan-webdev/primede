// relations for shared db 
import { DataTypes, } from 'sequelize';

import sequelize from '../../../../database/index.js';
const Permission = sequelize.define("Permission", {
  api: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
  method: {
    type: DataTypes.ENUM("GET", "POST", "PUT", "DELETE", "PATCH"),
  },
  handler: { type: DataTypes.STRING, }
}, {
  indexes: [{
    unique: true,
    fields: ["api", "method", "endpoint", "handler"]
  }],
});

Permission.sync();
export default Permission;