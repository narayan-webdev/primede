// const { Op, literal, or } = require("sequelize");

export default (query) => {
  const orderBy = (query.orderBy ? [Object.keys(query.orderBy)[0], query.orderBy[Object.keys(query.orderBy)[0]]] : ["id", "desc"]);
  return [orderBy]
}
