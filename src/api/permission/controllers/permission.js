// Controller function to create a new post

import { Op } from "sequelize";
import { Super_Admin, Admin, Staff } from "../../../constants/permissions.js";
import { Permission } from "@aws-sdk/client-s3";
import Role_permission from "../models/role_permission.js";

export async function generateLists(req, res) {
  try {


    const permissions = await Permission.findAll({ raw: true })
    for (const item of permissions) {
      await Role_permission.create({ RoleId: 1, PermissionId: item.id })
    }
    return res.status(200).send({ message: "Permission Generated Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function create(req, res) {
  try {

    const { RoleId, PermissionId } = req.body;
    const lists = [];

    for (const permission of PermissionId) {
      const [found, created] = await Role_permission.findOrCreate({
        where: { PermissionId: permission, RoleId },
        defaults: { RoleId, PermissionId: permission },
      });
      lists.push([found, created]);
    }

    return res.status(200).send(lists);

    // const permission = await Role_permission.create(req.body);
    // return res.status(200).send({ data: permission, message: "Permission Created Successfully!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function find(req, res) {
  try {
    const allPermissions = await Permission.findAll({
      include: ["roles"],
      where: {
        api: {
          [Op.in]: (req.subdomain === null ? Super_Admin : Admin)
        }
      }

    });

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

    return res.status(200).send({ data: groupedArray });
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
export async function staffPermission(req, res) {
  try {



    const allPermissions = await Permission.findAll({
      where: { api: { [Op.in]: Staff } },
      include: ["roles"],
    });
    const groupedData = allPermissions.reduce((grouped, item) => {
      const api = item.api;
      if (!grouped[api.Staff]) {
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
    return res.status(200).send({ data: groupedArray });
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
    const permission = await Permission.findByPk(id, {
      include: "roles",
    });

    if (permission) {
      return res.status(200).send({ data: permission });
    } else {
      return res.status(404).send(errorResponse({ error: "Permission not found" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  try {

    const { id } = req.params;
    const [updatedRowsCount] = await Permission.update(req.body, { where: { id } });

    if (updatedRowsCount > 0) {
      return res.status(200).send({ message: "Permission updated successfully!" });
    } else {
      return res.status(404).send(errorResponse({ error: "Permission not found" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const deletedRowCount = await Permission.destroy({
      where: { id },
    });

    if (deletedRowCount > 0) {
      return res.status(200).send({ message: "Permission deleted successfully!" });
    } else {
      return res.status(404).send(errorResponse({ error: "Permission not found" }));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as _delete };
