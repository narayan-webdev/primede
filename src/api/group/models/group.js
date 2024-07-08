import { DataTypes } from "sequelize";

import sequelize from '../../../../database/index.js';
const Group = sequelize.define("Group", {
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Group.sync();
export default Group;