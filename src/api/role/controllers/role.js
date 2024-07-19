// Controller function to create a new role
import { getPagination, getMeta } from "../../../services/pagination.js";

import { errorResponse } from "../../../services/errorResponse.js";
import role from "../../../constants/role.js";
import { Op } from "sequelize";
import Role_permission from "../../permission/models/role_permission.js";


export async function create(req, res) {
  try {

    const { name, description, permissions } = req.body;
    const capName = () => name.replace(/^./, (match) => match.toUpperCase());
    let CaptName = capName();
    const role = await Role.findOrCreate({
      where: { name: CaptName },
      defaults: { description },
    });

    if (permissions.length > 0) {
      for (const item of permissions) {
        const [found, created] = await Role_permission.findOrCreate({
          where: { PermissionId: item, RoleId: role[0].id },
          defaults: { RoleId: role[0].id, PermissionId: item },
        });
      }
    }
    return res.status(200).send({ data: role[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(error);
  }
}

// Controller function to get all roles
export async function find(req, res) {
  try {

    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const roles = await Role.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: [["name", "asc"]],
    });

    const meta = await getMeta(pagination, roles.count);

    return res.status(200).send({ data: roles.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
        details: error.message,
      })
    );
  }
}


export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const role = await Role.findByPk(id, {
      include: ["permissions"],
    });


    if (role) {
      const { id, name, description, createdAt, updatedAt, permissions } = role
      const allPermissions = permissions
      allPermissions
      const groupedData = allPermissions.reduce((grouped, item) => {
        const api = item.api;
        if (!grouped[api]) {
          grouped[api] = [];
        }
        grouped[api].push(item);
        return grouped;
      }, {});

      const groupedArray = Object.entries(groupedData).map(([api, items]) => ({
        api,
        items,
      }));

      groupedArray.sort((a, b) => a.api.localeCompare(b.api));
      return res.status(200).send({ data: { id, name, description, createdAt, updatedAt, permissions: groupedArray } });
    } else {
      return res.status(404).send(
        errorResponse({
          status: 404,
          message: "Role not found!",
          details: "role id seems to be invalid",
        })
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(
      errorResponse({
        status: 500,
        message: "Internal server Error",
      })
    );
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const { name, description, permissions, delete_permissions } = req.body;
    const capName = () => name.replace(/^./, (match) => match.toUpperCase());
    const findRole = await Role.findByPk(id);

    if (!findRole) {
      return res
        .status(400)
        .send(errorResponse({ message: "Invalid Role ID" }));
    }
    let roleData = role.find((r) => r.name === findRole.name);
    if (roleData) {
      return res.status(400).send(errorResponse({ message: "You can not update this role" }))
    }
    await findRole.update({ name: capName(), description }, { where: { id }, });

    if (permissions.length > 0) {
      for (const item of permissions) {
        const [found, created] = await Role_permission.findOrCreate({
          where: { PermissionId: item, RoleId: id },
          defaults: { RoleId: id, PermissionId: item },
        });
      }
    }
    if (delete_permissions.length > 0) {
      await Role_permission.destroy({
        where: {
          [Op.and]: [{ PermissionId: { [Op.in]: [...delete_permissions] } }, { RoleId: id }]
        }
      })
    }

    return res.status(200).send({ message: "Role Updated successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}


export const _delete = async (req, res) => {
  const t = await sequelize.transaction();
  try {

    const { id } = req.params;
    const findRole = await Role.findByPk(id);
    if (!findRole) {
      return res
        .status(400)
        .send(errorResponse({ status: 400, message: "Invalid  ID" }));
    }
    let roleData = role.find((r) => r.name === findRole.name);
    if (roleData) {
      return res
        .status(400)
        .send(errorResponse({ message: "You can not delete this role" }));
    }
    await findRole.destroy({
      where: { id },
      transaction: t
    });
    await Role_permission.destroy({
      where: { RoleId: id },
      transaction: t
    });
    await t.commit();
    return res.status(200).send({ message: `Role ${id} Deleted!!` });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
