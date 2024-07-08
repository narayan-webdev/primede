import { Sequelize } from "sequelize";
import app from "../../server.js";
import listAPis from "../api/permission/services/apiLists.js";
import apiGenerator from "../api/permission/services/generator.js";
import Permission from "../api/permission/models/permission.js";
/**
 * 
 * @param {*} sequelize 
 * @returns {Array} - returns the ids 
 */
export default async (sequelize) => {
  // const permission_list = await listAPis(app);
  let permissionArray = await apiGenerator()


  const permission = await Permission.bulkCreate(permissionArray, { updateOnDuplicate: ["api", "method", "endpoint", "handler"] })

  return permission.map((item => {
    return item.id
  }))
};

export async function staffPermission(sequelize, staffPermission = []) {
  for (const item of staffPermission) {
    await Staff_permission.findOrCreate({
      where: {
        api: item.api,
        method: item.method,
        endpoint: item.endpoint,
        handler: item.handler,
      },
    });
  }
}
