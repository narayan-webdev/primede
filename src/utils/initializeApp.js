import Permission from "../api/permission/models/permission.js"
import Role_permission from "../api/permission/models/role_permission.js"
import Role from "../api/role/models/role.js"
import User from "../api/user/models/user.js"
import role from "../constants/role.js"
import { hash } from "../services/bcrypt.js"
import * as permission_list from "../constants/permission.list.js"
import { Op } from 'sequelize';
export default async (sequelize) => {
    const hasPass = await hash("admin@123")
    const SuperAdmin = await User.findOrCreate({
        where: {
            "username": "admin",
            "email": "admin@gmail.com"
        },
        defaults: {
            "password": hasPass,
            "name": "Admin"
        }
    })

    // roles 

    const roles = await Role.bulkCreate(role, { updateOnDuplicate: ["name"] })
    // console.log(roles)
    const SuperAdminRole = roles.find((item) => item.name === "Super_Admin")
    const ConumerRole = roles.find((item) => item.name === "Consumer")
    console.log(ConumerRole)
    SuperAdmin[0].RoleId = SuperAdminRole?.id
    await SuperAdmin[0].save();

    // assign persmission to Super Admin
    const allPermissions = await Permission.findAll({ attributes: ["id"] })
    const allPermissionArray = allPermissions.map((item) => {
        return {
            RoleId: SuperAdminRole.id,
            PermissionId: item.id
        }
    })
    const consumersPermissionlist = permission_list.Consumer;
    const consumerPermissions = await Permission.findAll({ where: { handler: { [Op.in]: consumersPermissionlist } } })

    const superadminPermission = await Role_permission.bulkCreate(allPermissionArray, { updateOnDuplicate: ["RoleId", "PermissionId"] })
    const ConsumerPermissions = await Role_permission.bulkCreate(consumerPermissions.map((item) => {
        return { PermissionId: item.id, RoleId: ConumerRole.id }
    }), { updateOnDuplicate: ["RoleId", "PermissionId"] })
    return true


}