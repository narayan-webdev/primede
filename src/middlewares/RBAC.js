import { verify } from "../services/jwt.js";
import { errorResponse } from "../services/errorResponse.js";
import { Op } from "sequelize";
import dbCache from './../utils/dbCache.js';
import Role from "../api/role/models/role.js";
import User from "../api/user/models/user.js";
import Permission from "../api/permission/models/permission.js";
import Role_permission from "../api/permission/models/role_permission.js";

export default async (req, res, next) => {
  try {
    let endpoint = req.api;
    let params = req.params;
    endpoint = Object.entries(params).reduce(
      (str, [key, value]) => str.replace(new RegExp(value, "g"), `:${key}`),
      endpoint
    );

    let user, role;
    if (req.headers.authorization) {
      console.log("token")
      const token = verify(req);
      if (token.error) return res.status(400).send({ error: token.error });
      user = await User.findOne({
        where: { id: token.id },
        include: [{ model: Role, as: "role" }],
      });

      if (!user || !user.role) {
        return res.status(403).send(
          errorResponse({
            status: 403,
            name: "ForbiddenError",
            message: "Forbidden",
            details: "You don't have permission to access this route  , no user found",
          })
        );
      }

      role = user.role;
    } else {
      const getrole = await Role.findOne({
        where: { name: "Public" },
      });
      role = getrole;

    }

    // console.log(user)

    if (user?.role?.name === "Staff") {
      console.log("Role Is Staff - RBAC")
      const permission = await Permission.findOne({
        where: [{ endpoint }, { method: req.method }],
      });


      if (!permission) {
        return res.status(403).send(
          errorResponse({
            status: 403,
            name: "ForbiddenError",
            message: "Forbidden",
            details: "You don't have permission to access this route , no permission found",
          })
        );
      }

      const StaffPermission = await User_permission.findOne({
        where: {
          [Op.and]: [
            , { UserId: user.id }, { PermissionId: permission.id }]
        },
      });

      if (StaffPermission) {
        return next()
      } else {
        return res.status(403).send(
          errorResponse({
            status: 403,
            // name: "ForbiddenError",
            message: "Forbidden",
            details: "You don't have permission to access this route , no staff permission alloted",
          })
        );
      }

    } else {
      console.log("Role Is NOT Staff - RBAC")
      console.log(endpoint, req.method)
      const permission = await Permission.findOne({
        where: [{ endpoint }, { method: req.method }],
      });

      if (!Permission) {
        return res.status(403).send(
          errorResponse({
            status: 403,
            message: "Forbidden",
            details: "You don't have permission to access this route",
          })
        );
      }

      const hasPermission = await Role_permission.findOne({
        where: { [Op.and]: [{ PermissionId: permission.id }, { RoleId: role.id }] },
      });

      if (hasPermission) {
        return await next()
      } else {
        console.log(user, permission, hasPermission)
        return res.status(403).send(
          errorResponse({
            status: 403,
            // name: "ForbiddenError",
            message: "Forbidden",
            details: "You don't have permission to access this route , no alloted permission found",
          })
        );
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
