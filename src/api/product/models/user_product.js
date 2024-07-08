import { DataTypes } from "sequelize";
import sequelize from '../../../../database/index.js';
import Product from './product.js';
import User from "../../user/models/user.js";
const User_product = sequelize.define("User_product", {
    UserId: {
        type: DataTypes.INTEGER,
        references: { model: User, key: "id" },
        unique: "user_product_ids"
    },
    ProductId: {
        type: DataTypes.INTEGER,
        unique: "user_product_ids",
        references: { model: Product, key: "id", }
    },
    selling_price: {
        type: DataTypes.INTEGER,
    }
}, {
    indexes: [{
        unique: true,
        fields: ["UserId", "ProductId"]
    }]
});
User_product.sync();
export default User_product;
