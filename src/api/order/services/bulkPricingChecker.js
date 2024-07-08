export default async function checkBulkPricing({
  variants,
  variants_details,
}) {
  var totalAmount = 0;
  var variantsPrice = {};
  for (const [i, it] of variants_details.entries()) {
      totalAmount += parseFloat(variants[i].quantity) * parseFloat(it.price);
    variantsPrice[it.id] = parseInt(variants[i].quantity) * parseFloat(it.price);
  }
  return { totalAmount, variantsPrice };
};
