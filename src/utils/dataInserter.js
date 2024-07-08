import { Op } from "sequelize"
import { Consumer } from "../constants/permission.list.js"
import { categories, banners, collections } from "../constants/prefildata.js"

/**
 * @param {Object} Object
 * @param {import("sequelize").Sequelize} Object.sequelize The Sequelize instance.
 * @param {import("sequelize").Transaction}Object.transaction
 * @param {Object}Object.body
 * @param {string}Object.personal_token
 * @returns {boolean} Returns Boolean.
 */
export default async ({ sequelize, transaction, body, personal_token }) => {
    try {
        for (const item of categories) {
            const categoryThumbnail = await Media.create({ name: "name", url: item.thumbnail }, { transaction: transaction })
            const category = await Category.create({ name: item.name, ThumbnailId: categoryThumbnail.id }, { transaction: transaction })
            // products 
            for (const product of item.products) {
                const productThumbnail = await Media.create({ name: "anme", url: product.thumbnail }, { transaction: transaction })
                const newProduct = await Product.create({
                    "cod_enabled": product.cod_enabled,
                    "description": product.description,
                    "enquiry_enabled": product.enquiry_enabled,
                    "is_active": product.is_active,
                    "name": product.name,
                    "product_return": product.product_return,
                    "shipping_value": product.shipping_value,
                    "shipping_value_type": product.shipping_value_type,
                    "show_price": product.show_price,
                    "ThumbnailId": productThumbnail.id,
                    "CategoryId": category.id
                }, { transaction: transaction })
                const product_metric = await Product_metric.create({ ProductId: newProduct.id }, { transaction: transaction })

                // product gallery
                for (const galleryItem of product.gallery) {
                    const GalleryMedia = await Media.create({
                        name: "name", url: galleryItem
                    }, { transaction: transaction })

                    const productGallery = await Product_gallery.create({
                        MediaId: GalleryMedia.id,
                        ProductId: newProduct.id
                    }, { transaction: transaction })
                }
                const variants = await Variant.bulkCreate(product.variants.map((v) => {
                    return { ...v, ProductId: newProduct.id }
                }), { transaction: transaction, })
            }
        }
        for (const item of banners) {
            const MediaDesktop = await Media.create({
                name: "name", url: item.image
            }, { transaction: transaction });
            const MediaModile = await Media.create({
                name: "name", url: item.image_mobile
            }, { transaction: transaction })

            const banner = await Banner.create({
                action: "COLLECTION",
                data: "string",
                "MobileThumbnailId": MediaModile.id,
                "DesktopThumbnailId": MediaDesktop.id
            }, { transaction: transaction })
        }
        for (const collection of collections) {
            await Collection.create({
                name: collection.name,
            })
        }
        // Roles and permissions
        const ConumerRole = await Role.findOne({ where: { name: "Consumer" }, transaction: transaction })

        const consumersPermissionlist = Consumer;
        const consumerPermissions = await Permission.findAll({
            where: { handler: { [Op.in]: consumersPermissionlist } },
            transaction: transaction
        })

        const array = consumerPermissions.map((item) => {
            return { PermissionId: item.dataValues.id, RoleId: ConumerRole.dataValues.id }
        })
        const ConsumerPermissions = await Role_permission.bulkCreate(array, { updateOnDuplicate: ["RoleId", "PermissionId"], transaction: transaction })

        const media = await Media.create({
            name: "brand-logo",
            url: body.logo
        }, { transaction: transaction })

        // global and setting 
        const storeGlobal = await Global_brand.create({
            store_type: body.store_type,
            name: body.brand_name,
            tagline: body.tag_line,
            calling_number: body.calling_number,
            whatsapp_number: body.whatsapp_number,
            address: body.address,
            youtube: body.youtube,
            instagram: body.instagram,
            youtube: body.youtube,
            facebook: body.facebook,
            telegram: body.telegram,
            LogoIdDark: media.id,
            LogoIdLight: media.id,
            FavIconId: media.id,
            email: body.email,
            address: body.address
        }, { transaction: transaction });

        const storeGlobalBrand = await Store_global.create({
            personal_id: personal_token,
            store_link: `https://${body.subdomain}.socialseller.in`
        }, { transaction: transaction })

        const storeSetting = await Store_setting.create({
            store_type: body.store_type,
            bg_color: "#222222"
        }, { transaction: transaction });

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}