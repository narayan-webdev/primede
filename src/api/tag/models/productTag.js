
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const ProductTag = sequelize.define("ProductTag", {

});

ProductTag.sync();
export default ProductTag;