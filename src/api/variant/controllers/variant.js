import { getPagination, getMeta } from "../../../services/pagination.js";
import { errorResponse } from "../../../services/errorResponse.js";
import Variant from "../models/variant.js";
import sequelize from "../../../../database/index.js";
const Variant_gallery = sequelize.models.Variant_gallery;

export async function create(req, res) {
  const t = await sequelize.transaction();
  try {

    const body = req.body;

    const primary_attribute = await Attribute.create({ name: variant.primary.name }, { transaction: t })
    const primary_attribute_value = await AttributeValue.create({
      value: variant.primary.values.value,
      hex_code: variant.primary.values.hex_code,
      AttributeId: primary_attribute.id
    }, { transaction: t })

    // secondary attribute 
    const secondary_attribute = await Attribute.create({ name: variant.secondary.name }, { transaction: t })
    const secondary_attribute_value = await AttributeValue.create({
      value: variant.secondary.values.value,
      hex_code: variant.secondary.values.hex_code,
      AttributeId: secondary_attribute.id
    }, { transaction: t })

    //variant
    // const newVariant = await Variant.create({
    //   name: variant.name,
    //   price: variant.price,
    //   strike_price: variant.price,
    //   quantity: variant.quantity,
    //   ProductId: product.id,
    //   from: variant.from,
    //   to: variant.to,
    //   ThumbnailId: variant.ThumbnailId,
    //   PrimaryAttributeId: primary_attribute_value.id,
    //   SecondaryAttributeId: secondary_attribute_value.id
    // }, { transaction: t })

    const variant = await Variant.create({
      ...req.body, PrimaryAttributeId: primary_attribute_value.id,
      SecondaryAttributeId: secondary_attribute_value.id
    }, { transaction: t });
    // variants gallery 


    let variant_gallery_body = [];
    if (body.gallery && body.gallery.length) {
      let obj = body.gallery.flatMap((item) => {
        return { MediaId: item, VariantId: variant.id };
      });
      variant_gallery_body.push(...obj);
      await Variant_gallery.bulkCreate(variant_gallery_body, { transaction: t });
    }
    await t.commit();
    return res.status(200).send({ message: "Variant created successfully!", data: variant });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}
// Controller function to get all posts
export async function find(req, res) {
  try {

    const Variant = sequelize.models.Variant;
    const query = req.query;

    const pagination = await getPagination(query.pagination);

    const variants = await Variant.findAndCountAll({
      include: ["thumbnail", "product", "gallery"],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, variants.count);

    return res.status(200).send({ data: variants.rows, meta });
  } catch (error) {
    console.log(error);

    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function findOne(req, res) {
  try {

    const { id } = req.params;
    const variant = await Variant.findByPk(id, {
      include: ["thumbnail", "product", "gallery"],
    });
    if (variant) {
      return res.status(200).send(variant);
    } else {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid Variant ID" }));
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export async function update(req, res) {
  const t = await sequelize.transaction();
  try {

    const { id } = req.params;
    const body = req.body;

    // Find the variant by id
    const variant = await Variant.findByPk(id);
    if (!variant) {
      return res.status(404).send(errorResponse({ message: "Variant not found" }));
    }

    // Update the variant
    const [updatedRowsCount, updatedVariants] = await Variant.update(body, {
      where: { id },
      returning: true,
      transaction: t,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).send(errorResponse({ message: "Variant not found" }));
    }

    // Handle variant gallery updates
    if (body.gallery && body.gallery.length > 0) {
      const variantMedia = await Variant_gallery.findAll({
        where: { VariantId: id },
        transaction: t,
      });

      const oldMediaIds = variantMedia.map((entry) => entry.MediaId);
      const newMediaIds = body.gallery;

      const mediaToAdd = newMediaIds.filter((mediaId) => !oldMediaIds.includes(mediaId));
      const mediaToRemove = oldMediaIds.filter((mediaId) => !newMediaIds.includes(mediaId));

      // Remove old media entries
      await Variant_gallery.destroy({
        where: { MediaId: mediaToRemove },
        transaction: t,
      });

      // Add new media entries
      const mediaToAddBulk = mediaToAdd.map((mediaId) => ({
        VariantId: id,
        MediaId: mediaId,
      }));

      await Variant_gallery.bulkCreate(mediaToAddBulk, { transaction: t });
    }
    await t.commit();
    return res.status(200).send({ message: "Variant updated successfully!", data: variant });
  } catch (error) {
    await t.rollback();
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
}

export const _delete = async (req, res) => {
  try {

    const { id } = req.params;
    const getVariant = await Variant.findByPk(id);
    if (!getVariant) {
      return res.status(400).send(errorResponse({ status: 400, message: "Invalid Variant ID" }));
    }
    const variant = await Variant.destroy({ where: { id } });
    await Variant_gallery.destroy({ where: { VariantId: id } });
    return res.status(200).send({ message: "variant deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal server Error" }));
  }
};
export { _delete as delete };
