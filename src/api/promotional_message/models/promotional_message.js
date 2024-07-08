
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Promotional_message = sequelize.define("Promotional_message", {
  title: {
    type: DataTypes.STRING,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
});

Promotional_message.sync();
export default Promotional_message
