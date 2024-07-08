import User from "../api/user/models/user.js";

export default async ({ subdomain, field_name = [] || "" }) => {
  try {
    const Tenant = await User.findOne({
      where: { subdomain },
      include: ["tenant_metric"],
    });
    if (Array.isArray(field_name)) {
      for (const item of field_name) {
        if (Tenant.tenant_metric !== null) {
          await Tenant_metric.increment(
            {
              [item]: 1,
            },
            {
              where: { UserId: Tenant.id },
            }
          );
        } else {
          await Tenant_metric.create({
            [item]: 1,
            UserId: Tenant.id,
          });
        }
      }
    } else {
      if (Tenant) {
        if (Tenant.tenant_metric !== null) {
          await Tenant_metric.increment(
            {
              [field_name]: 1,
            },
            {
              where: { UserId: Tenant.id },
            }
          );
        } else {
          await Tenant_metric.create({
            [field_name]: 1,
            UserId: Tenant.id,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
