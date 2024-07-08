export async function handleVariantsTotalPrice(cartVariants, sequelize) {
  const result = await Promise.all(
    cartVariants.map(async (cartVariant) => {
      const variant = await Variant.findByPk(
        cartVariant.VariantId
      );
      return {
        quantity: cartVariant.quantity,
        variant,
        totalPrice: variant.price * cartVariant.quantity,
      };
    })
  );
  return result;
}
