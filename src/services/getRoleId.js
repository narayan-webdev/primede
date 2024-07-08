export default async (role, sequelize) => {
  const role_data = await Role.findOne({
    where: { name: role },
    attributes: ["id"],
  });
  return role_data.id;
};
