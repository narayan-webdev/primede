
import { DataTypes } from 'sequelize';

import sequelize from '../../../../database/index.js';
// Define the Post model using the provided Sequelize instance
const Story = sequelize.define("Story", {

});

Story.sync();
export default Story;