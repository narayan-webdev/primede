import {  errorResponse } from "../../../services/errorResponse.js";
import { verify } from "../../../services/jwt.js";
import Variant from "../../variant/models/variant.js";
import Cart from "../models/cart.js";
import CartVariant from "../models/cartVariant.js";
// const cart = require("../models/cart");

export async function addToCart(req, res) {
  try {
    const { VariantId, quantity } = req.body;
    const token = verify(req);
    let findCart = await Cart.findOne({ where: { UserId: 1 } });
    if (findCart === null) {
      findCart = await Cart.create({ totalPrice: 0, UserId: 1 });
    }

    const cartVariant = await CartVariant.findOne({
      where: {
        VariantId: VariantId,
        CartId: findCart.id,
      },
    });

    if (cartVariant) {
      cartVariant.increament({ quantity: quantity });
      await cartVariant.save();
    } else {
      await cartVariant.create({
        VariantId: VariantId,
        CartId: findCart.id,
        quantity: quantity,
      });
    }

    const variant = await Variant.findByPk(VariantId);
    findCart.increament({ totalPrice: variant.price * quantity });
    await findCart.save();
    return res.status(200).send({ message: "Variants added to cart successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}

export async function consumerCart(req, res) {
  try {

    const token = verify(req);
    const cartVariants = await CartVariant.findAll({
      include: [
        { model: sequelize.models.Cart, where: { UserId: 1 } },
        { model: sequelize.models.Variant, attributes: ["id", "name", "price"] },
      ],
    });

    if (!cartVariants) {
      return res.status(404).send({
        message: `No cart variants found for user with id=${token.id}`,
      });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const cartVariant of cartVariants) {
      totalPrice += cartVariant.quantity * cartVariant.Variant.price;
    }

    // Add total price to each variant
    const variantsWithTotalPrice = cartVariants.map((cartVariant) => {
      return {
        ...cartVariant.toJSON(),
        totalVariantPrice: cartVariant.quantity * cartVariant.Variant.price,
      };
    });

    return res.status(200).send({
      cartVariants: variantsWithTotalPrice,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

export async function emptyCart(req, res) {
  try {

    const token = verify(req);

    const findCart = await Cart.findOne({ where: { UserId: token.id } });

    if (findCart === null) {
      const cart = await Cart.create({
        totalPrice: 0,
        UserId: token.id,
      });
      return res.status(200).send({ message: "Your cart is empty now!" });
    }

    const destroyCart = await CartVariant.destroy({
      where: { CartId: findCart.id },
    });

    await findCart.update({ totalPrice: 0 });
    return res.status(200).send({ message: "Your cart is empty now!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse({ status: 500, message: "Internal Server Error" }));
  }
}

export async function deleteVariant(req, res) {
  try {

    const { id } = req.params;
    const token = verify(req);
    const cart = await Cart.findOne({ where: { UserId: 1 } });

    if (!cart) {
      return res.status(404).send(errorResponse({ status: 400, message: "Invalid variant id" }));
    }

    const cartVariant = await CartVariant.findOne({
      where: {
        VariantId: id,
        CartId: cart.id,
      },
      include: [sequelize.models.Variant],
    });

    if (!cartVariant) {
      return res.status(404).send({
        message: `Variant with id ${id} not found in the cart.`,
      });
    }

    const totalPriceReduction = cartVariant.Variant.price * cartVariant.quantity;

    await cartVariant.destroy();

    cart.totalPrice -= totalPriceReduction;
    await cart.save();

    return res.status(200).send({
      message: `Variant with id ${id} deleted from the cart successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
