
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Privacy_policy = sequelize.define("Privacy_policy", {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descrpition: {
    type: DataTypes.TEXT,
    allowNull: false
  },
});
Privacy_policy.sync();
export default Privacy_policy;