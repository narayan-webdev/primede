// relations for shared db 
import { DataTypes, Sequelize } from 'sequelize';


import sequelize from '../../../../database/index.js';
import Role from '../../role/models/role.js';
import Permission from './permission.js';
const Role_permission = sequelize.define("Role_permission", {
    PermissionId: {
        type: DataTypes.INTEGER,
        references: { model: Permission, key: "id" },
        unique: "role_permission_ids"
    },
    RoleId: {
        type: DataTypes.INTEGER,
        unique: "role_permission_ids",
        references: { model: Role, key: "id", }
    }
}, {
    indexes: [{
        unique: true, fields: ["RoleId", "PermissionId"]
    }]
});
Role_permission.sync();
export default Role_permission;