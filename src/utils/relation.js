
import Support_ticket from "../api/support_ticket/models/support_ticket.js";
import Global_brand from "../api/global_brand/models/global_brand.js";
import Transaction from "../api/transaction/models/transaction.js";
import Product from "../api/product/models/product.js";
import Variant from "../api/variant/models/variant.js";
import Media from "../api/upload/models/media.js";
import Category from "../api/category/models/category.js";
import Tag from "../api/tag/models/tag.js";
import ProductTag from "../api/tag/models/productTag.js";
import Banner from "../api/banner/models/banner.js";
import Lead from "../api/lead/models/lead.js";
import Privacy_policy from "../api/privacy_policy/models/privacy_policy.js";
import Cart from "../api/cart/models/cart.js";
import CartVariant from "../api/cart/models/cartVariant.js";
import Campaign from "../api/campaign/models/campaign.js";
import Collection from "../api/collection/models/collection.js";
import Custom_courier from "../api/custom_courier/models/custom_courier.js";
import Product_metrics from "../api/product_metrics/models/product_metrics.js";
import Sub_category from "../api/sub_category/models/sub_category.js";
import Policy from "../api/policy/models/policy.js";
import Setting from "../api/setting/models/setting.js";
import Group from "../api/group/models/group.js";
import User from "../api/user/models/user.js";
import Address from "../api/address/models/address.js";
import Order from "../api/order/models/order.js";
import Order_variant from "../api/order_variant/models/order_variant.js";
import Wallet from "../api/wallet/models/wallet.js";
import Role from "../api/role/models/role.js";
import Permission from "../api/permission/models/permission.js";
import Role_permission from "../api/permission/models/role_permission.js";
import Activity_log from "../api/activity_log/models/activity_log.js";
// import Transaction from "../api/transaction/models/transaction.js";
import Global from "../api/global/models/global.js";
import Payment_log from "../api/payment_log/models/payment_log.js";
import support_ticket from "../api/support_ticket/models/support_ticket.js";
import Ship_rocket_order from "../api/ship_rocket_order/models/ship_rocket_order.js";
import Ship_rocket_orderitem from "../api/ship_rocket_orderitem/models/ship_rocket_orderitem.js";
import Ship_rocket_return from "../api/ship_rocket_return/models/ship_rocket_return.js";
import Order_status_tracker from "../api/order_status_tracker/models/order_status_tracker.js";
import Notification from "../api/notification/models/notification.js";
import Payout_log from "../api/payout_log/models/payout_log.js";
import Product_policy from "../api/product_policy/models/product_policy.js";
import Promitional_message from "../api/promotional_message/models/promotional_message.js";
import Testimonial from "../api/testimonial/models/testimonial.js";
import Story from "../api/story/models/story.js";
import Return_order from "../api/return_order/models/return_order.js";
import Product_review from "../api/product_review/models/product_review.js";
import Marquee from "../api/marquee/models/marquee.js";
import Coupon from "../api/coupon/models/coupon.js";
import sequelize from "../../database/index.js";
import User_product from "../api/product/models/user_product.js";
import Attribute from "../api/variant/models/attribute.js";
import AttributeValue from "../api/variant/models/attributevalue.js";

// #################### Product , Variant , Tag ,Bulk Pricing and Collection and Collection_static Association #################
Attribute.hasMany(AttributeValue, { foreignKey: "AttributeId", as: "values" })
AttributeValue.belongsTo(Attribute, { foreignKey: "AttributeId", as: "attribute" })

Product.hasMany(Variant, { foreignKey: "ProductId", as: "variants" });
Variant.belongsTo(Product, { foreignKey: "ProductId", as: "product" });

AttributeValue.hasMany(Variant, { foreignKey: "PrimaryAttributeId", })
Variant.belongsTo(AttributeValue, { foreignKey: "PrimaryAttributeId", as: "primary_attribute" })

AttributeValue.hasMany(Variant, { foreignKey: "SecondaryAttributeId", })
Variant.belongsTo(AttributeValue, { foreignKey: "SecondaryAttributeId", as: "secondary_attribute" })

Tag.belongsToMany(Product, { as: "products", through: ProductTag });
Product.belongsToMany(Tag, { as: "tags", through: ProductTag });

// Variant.hasMany(Bulk_pricing, { foreignKey: "VariantId", as: "bulk_pricings" });
// Bulk_pricing.belongsTo(Variant, { foreignKey: "VariantId", as: "variants" });

Collection.belongsToMany(Product, { as: "products", through: "CollectionProduct" });
Product.belongsToMany(Collection, { as: "collections", through: "CollectionProduct" });


// ########## produt reviews #############
Product.hasMany(Product_review, { foreignKey: "ProductId", as: "product_reviews" })
Product_review.belongsTo(Product, { foreignKey: "ProductId", as: "product" })
Product_review.belongsToMany(Media, { through: "Product_review_gallery", as: 'gallery' })
Media.belongsToMany(Product_review, { through: "Product_review_gallery", as: 'product_review' })
User.hasMany(Product_review, { foreignKey: "UserId", as: "product_reviews" })
Product_review.belongsTo(User, { foreignKey: "UserId", as: "user" })
Product_review.belongsTo(Media, { foreignKey: "AvatarId", as: "avatar" })

Lead.belongsTo(Product, { foreignKey: "ProductId", "as": "product" })
Product.hasMany(Lead, { foreignKey: "ProductId", as: "leads" })
// #################### Product , Category and Sub Category Association #################
Category.hasMany(Product, { foreignKey: "CategoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "CategoryId", as: "category" });
Category.hasMany(Sub_category, { foreignKey: "CategoryId", as: "subCategories" });
Sub_category.belongsTo(Category, { foreignKey: "CategoryId", as: "category" });
Sub_category.hasMany(Product, { foreignKey: "SubCategoryId", as: "products", });
Product.belongsTo(Sub_category, { foreignKey: "SubCategoryId", as: "sub_category", });

// ################ Cart , Cartvariant and variant Association ###############
Cart.belongsToMany(Variant, { through: "CartVariant" });
Variant.belongsToMany(Cart, { through: "CartVariant" });
CartVariant.belongsTo(Cart);
CartVariant.belongsTo(Variant);
User.belongsTo(Cart, { foreignKey: "CartId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "UserId", as: "User" });

support_ticket.belongsTo(User, { foreignKey: "UserId", as: "User" });

Role.hasMany(User, { foreignKey: "RoleId", as: "users" });
User.belongsTo(Role, { foreignKey: "RoleId", as: "role" });
Role.belongsToMany(Permission, { as: "permissions", through: Role_permission });
Permission.belongsToMany(Role, { as: "roles", through: Role_permission });

// ################ Media Association ###############
Category.belongsTo(Media, { foreignKey: "ThumbnailId", as: "thumbnail" });
Sub_category.belongsTo(Media, { foreignKey: "ThumbnailId", as: "thumbnail" });
Product.belongsTo(Media, { foreignKey: "ThumbnailId", as: "thumbnail" });
Variant.belongsTo(Media, { foreignKey: "ThumbnailId", as: "thumbnail" });

Product.belongsToMany(Media, { foreignKey: "ProductId", through: "Product_gallery", as: "gallery" });
Media.belongsToMany(Product, { foreignKey: "MediaId", through: "Product_gallery" });

Variant.belongsToMany(Media, { foreignKey: "VariantId", through: "Variant_gallery", as: "gallery" });
Media.belongsToMany(Variant, { foreignKey: "MediaId", through: "Variant_gallery" });

Collection.belongsTo(Media, { foreignKey: "ThumbnailId", as: "thumbnail" });
Media.belongsToMany(Custom_courier, { through: "Courier_media_link", foreignKey: "MediaId", as: "custom_couriers" });

// ################ Lead Association ###############
Lead.belongsTo(User, { foreignKey: "AssignedTo", as: "assigned_to" });
User.hasMany(Lead, { foreignKey: "AssignedTo", as: "leads" });
Lead.belongsTo(User, { foreignKey: "UserId", as: "user" })

// ################ Store User and Media ############################
User.belongsTo(Media, { foreignKey: "AvatarId", as: "avatar" })
// ################ Store User and Address Association ###############
User.hasMany(Address, { foreignKey: "UserId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "UserId", as: "User" });
Order.belongsTo(Address, { foreignKey: "AddressId", as: "address" });

// ################### Product and Product Metrics ##################
Product_metrics.belongsTo(Product, { foreignKey: "ProductId", as: "product" });
Product.hasOne(Product_metrics, { foreignKey: "ProductId", as: "product_metrics" });

// ################### Store Server Subscription and Store User##################

// ############## testimonials ###############
Testimonial.belongsTo(User, { foreignKey: "UserId", as: "user" })
Testimonial.belongsTo(Media, { foreignKey: "VideoId", as: "video" })
db.Testimonial.belongsTo(db.Media, { foreignKey: "ThumbnailId", as: "thumbnail" })

//############# story and products
Story.belongsTo(Media, { foreignKey: "VideoId", as: "video" });
Story.belongsToMany(Product, { as: "products", through: "StoryProduct" })
Product.belongsToMany(Story, { as: "stories", through: "StoryProduct" })
Story.belongsTo(Media, { foreignKey: "ThumbialId", as: "thumbnail" })
// ##################### store user order order variant and wallet association ###############
User.hasOne(Order);
Order.belongsTo(User, { foreignKey: "UserId", as: "User" });
Order_variant.belongsTo(Variant, { foreignKey: "VariantId", as: "variant" });

Order_variant.hasMany(Order_status_tracker, { foreignKey: "OrderVariantId", as: "status_tracker" });
Order_status_tracker.belongsTo(Order_variant, { foreignKey: "OrderVariantId", as: "order_variant" });

Order.hasMany(Order_variant, { foreignKey: "OrderId", as: "orderVariants" });
Order_variant.belongsTo(Order, { foreignKey: "OrderId", as: "order" });
User.hasMany(Wallet, { foreignKey: "UserId", as: "wallets" });
Wallet.belongsTo(User, { foreignKey: "UserId", as: "User" })
User.hasMany(Payout_log, { foreignKey: "UserId", as: "payout_logs" });
//########### Activity Log and Transaction Association ##################
User.hasMany(Activity_log, { foreignKey: "UserId", as: "activity_logs" });
Activity_log.belongsTo(User, { foreignKey: "UserId", as: "user" });
// Transaction.belongsTo(User, { foreignKey: "UserId", as: "user" });

// ############### ShipRocket Associations ###########
Ship_rocket_order.hasMany(Ship_rocket_orderitem, { foreignKey: "ShipRocketOrderId", as: "orderItems" });
Ship_rocket_orderitem.belongsTo(Ship_rocket_order, { foreignKey: "ShipRocketOrderId", as: "shipRocketOrder" });
Order_variant.belongsTo(Ship_rocket_orderitem, { foreignKey: "ShipRocketOrderItemId", as: "shipRocketOrderItem" });
Ship_rocket_orderitem.belongsTo(Order_variant, { foreignKey: "OrderVariantId", as: "orderVariant" });
Ship_rocket_orderitem.belongsTo(Ship_rocket_return, { foreignKey: "ShipRocketReturnId", as: "shipRocketReturn" });
Ship_rocket_return.hasMany(Ship_rocket_orderitem);

// ############### Custom Courier Associations ###########
Custom_courier.belongsToMany(Media, { through: "Courier_media_link", foreignKey: "CustomCourierId", as: "media" });
Custom_courier.belongsTo(Order_variant, { foreignKey: "OrderVariantId", as: "order_variant" });
Order_variant.belongsTo(Custom_courier, { foreignKey: "CustomCourierId", as: "custom_couriers" });

Global_brand.belongsTo(Media, { foreignKey: "LogoIdDark", as: "logo_dark" })
Global_brand.belongsTo(Media, { foreignKey: "LogoIdLight", as: "logo_light" })
Global_brand.belongsTo(Media, { foreignKey: "FavIconId", as: "favicon" })
Banner.belongsTo(Media, { foreignKey: "MobileThumbnailId", as: "mobile_thumbnail" })
Banner.belongsTo(Media, { foreignKey: "DesktopThumbnailId", as: "desktop_thumbnail" })

//############# return order and media
Return_order.belongsTo(Media, { foreignKey: "ImageId", as: "image" })
Return_order.belongsTo(User, { foreignKey: "UserId", as: "user" })
User.hasMany(Return_order, { foreignKey: "UserId", as: "return_orders" })
Return_order.belongsTo(Order_variant, { foreignKey: "OrderVariantId", as: "order_variant" })

Marquee.belongsTo(Media, { foreignKey: "ImageId", as: "image", })

Coupon.belongsTo(Collection, {
  foreignKey: "CollectionId",
  as: "collection",
});
Collection.hasMany(Coupon, {
  foreignKey: "CollectionId",
  as: "coupons",
});
Coupon.belongsTo(Media, {
  foreignKey: "MediaId",
  as: "image",
});

// await sequelize.sync({ alter: true });
