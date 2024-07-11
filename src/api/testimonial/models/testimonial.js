
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Testimonial = sequelize.define("Testimonial", {
  name: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.DECIMAL,
  },
});

Testimonial.sync();
export default Testimonial;