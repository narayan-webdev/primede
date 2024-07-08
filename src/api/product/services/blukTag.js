import ProductTag from "../../tag/models/productTag.js";
import Tag from "../../tag/models/tag.js";

export default async ({ sequelize, tags, ProductId, transaction }) => {
  console.log(tags)
  console.log(tags.map((item) => item))
  const createdTags = await Promise.all(
    tags.map((tag) => {
      return Tag.findOrCreate({
        where: { name: tag.toLowerCase() },
        transaction: transaction,
      });
    })
  );
  const tagsToCreate = [];
  const resultIds = createdTags.map((item) => {
    tagsToCreate.push({ TagId: item[0].id, ProductId });
  });

  const productTag = await ProductTag.bulkCreate(
    tagsToCreate,
    { transaction: transaction }
  );
  return productTag;
};
