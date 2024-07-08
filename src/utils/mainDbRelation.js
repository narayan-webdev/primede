// import user from "../api/user2/models/user.js";
import role from "../api/role/models/role.js";
import permission from "../api/permission/models/permission.js";
import role_permission from "../api/permission/models/role_permission.js";
import plan from "../api/plan/models/plan.js";
import server_subscription from "../api/server_subscription/models/server_subscription.js";
import global from "../api/global/models/global.js";
import payment_log from "../api/payment_log/models/payment_log.js";
import support_ticket from "../api/support_ticket/models/support_ticket.js";
import cart from "../api/cart/models/cart.js";
import global_brand from "../api/global_brand/models/global_brand.js";
import store_setting from "../api/setting/models/setting.js";
import free_plan from "../api/free_plan/models/free_plan.js";
import plan_metrics from "../api/plan_metrics/models/plan_metrics.js";
import tenant_metric from "../api/tenant_metric/models/tenant_metric.js";
import activity_log from "../api/activity_log/models/activity_log.js";
import transaction from "../api/transaction/models/transaction.js";
import upload from "../api/upload/models/media.js";
import lead from "../api/lead/models/lead.js";
import banner from "../api/banner/models/banner.js";

// export default async (sequelize) => {
//   const db = {};
//   db.sequelize = sequelize;
//   db.Permission = permission(sequelize);
//   db.Role = role(sequelize);
//   db.User = user(sequelize);
//   db.Role_permission = role_permission(sequelize);
//   db.Server_subscription = server_subscription(sequelize);
//   db.Global = global(sequelize);
//   db.Payment_log = payment_log(sequelize);
//   db.Plan = plan(sequelize);
//   db.Cart = cart(sequelize);
//   db.Support_ticket = support_ticket(sequelize);
//   db.Global_brand = global_brand(sequelize);
//   db.Store_setting = store_setting(sequelize);
//   db.Free_plan = free_plan(sequelize);
//   db.Activity_log = activity_log(sequelize);
//   db.Plan_metrics = plan_metrics(sequelize);
//   db.Tenant_metric = tenant_metric(sequelize);
//   db.Transaction = transaction(sequelize);
//   db.Media = upload(sequelize);
//   db.Lead = lead(sequelize)
//   db.Banner = banner(sequelize)
//   // User -> Role
//   db.Role.hasMany(db.User, { foreignKey: "RoleId", as: "users" });
//   db.User.belongsTo(db.Role, { foreignKey: "RoleId", as: "role" });
//   db.Global.belongsTo(db.Media, { foreignKey: "LogoId", as: "logo" });
//   // Support Ticket -> User
//   db.Support_ticket.belongsTo(db.User, { foreignKey: "UserId", as: "user" });
//   // Role -> Permission
//   db.Role.belongsToMany(db.Permission, {
//     as: "permissions",
//     through: db.Role_permission,
//   });
//   db.Permission.belongsToMany(db.Role, {
//     as: "roles",
//     through: db.Role_permission,
//   });
//   // User -> Subscription
//   db.User.hasMany(db.Server_subscription, {
//     foreignKey: "UserId",
//     as: "subscriptions",
//   });
//   db.Server_subscription.belongsTo(db.User, {
//     foreignKey: "UserId",
//     as: "user",
//   });
//   // // Plan -> Subscription
//   db.Plan.hasMany(db.Server_subscription, {
//     foreignKey: "PlanId",
//     as: "subscriptions",
//   });
//   db.Server_subscription.belongsTo(db.Plan, {
//     foreignKey: "PlanId",
//     as: "plan",
//   });

//   // User -> Activity_log
//   db.User.hasMany(db.Activity_log, {
//     foreignKey: "UserId",
//     as: "activity_logs",
//   });
//   db.User.hasMany(db.Lead, {
//     foreignKey: "AssignedTo",
//     as: "leads",
//   });
//   db.Lead.belongsTo(db.User, { foreignKey: "AssignedTo", as: "assigned_to" });

//   db.Activity_log.belongsTo(db.User, { foreignKey: "UserId", as: "user" });

//   db.Plan_metrics.belongsTo(db.Plan, { foreignKey: "PlanId", as: "plan" });
//   db.Plan.hasOne(db.Plan_metrics, { foreignKey: "PlanId", as: "plan_metrics" });

//   db.Tenant_metric.belongsTo(db.User, { foreignKey: "UserId", as: "user" });

//   db.User.hasOne(db.Tenant_metric, {
//     foreignKey: "UserId",
//     as: "tenant_metric",
//   });

//   db.User.hasMany(db.Transaction, { foreignKey: "UserId", as: "transaction" });
//   db.Transaction.belongsTo(db.User, { foreignKey: "UserId", as: "user" });

//   db.Payment_log.belongsTo(db.User, {
//     foreignKey: "UserId",
//     as: "user",
//   });

//   db.Permission.belongsToMany(db.User, { through: "User_permission", as: "users" });
//   db.User.belongsToMany(db.Permission, { through: "User_permission", as: "permissions" });

//   db.Banner.belongsTo(db.Media, { foreignKey: "MobileThumbnailId", as: "mobile_thumbnail" })
//   db.Banner.belongsTo(db.Media, { foreignKey: "DesktopThumbnailId", as: "desktop_thumbnail" })

//   db.Global_brand.belongsTo(db.Media, { foreignKey: "LogoIdDark", as: "logo_dark" })
//   db.Global_brand.belongsTo(db.Media, { foreignKey: "LogoIdLight", as: "logo_light" })
//   db.Global_brand.belongsTo(db.Media, { foreignKey: "FavIconId", as: "favicon" })

//   return db.sequelize;
// };
