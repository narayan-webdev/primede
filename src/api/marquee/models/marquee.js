
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
const Marquee = sequelize.define("Marquee", {
  name: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
});

Marquee.sync();
export default Marquee;