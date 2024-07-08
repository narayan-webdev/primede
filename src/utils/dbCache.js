import nodeCache from "node-cache";
const dbCache = new nodeCache({ stdTTL: 10000 });

export default dbCache;
