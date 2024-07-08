const { Sequelize, Op } = require('sequelize');
const dbConfig = require('../../config/db.config');
const mainDbRelation = require('./mainDbRelation');
const fs = require("fs");
const relation = require('./relation');
async function getDUMPData() {
    const mainDb = {};
    const sequelize = new Sequelize(dbConfig);
    mainDb.sequelize = await mainDbRelation(sequelize);
    const mainSequelize = mainDb.sequelize;
    const users = await mainSequelize.models.User.findAll({ raw: true, where: { database: { [Op.ne]: null } } });
    const data = [];
    for (const user of users) {
        const tenant = new Sequelize({
            dialect: dbConfig.dialect,
            host: dbConfig.host,
            port: dbConfig.port,
            username: user.username,
            password: user.password,
            database: user.database,
            pool: dbConfig.pool,
            logging: dbConfig.logging,
        });

        const tenantSequelize = await relation(tenant);
        const storeUser = await tenantUser.findOne({ where: { RoleId: 1 }, raw: true })
        data.push(storeUser)
        tenantSequelize.close();
    }

    console.log(data)
    fs.writeSync("data.json", JSON.stringify(data))
}
// getDUMPData();
function writeFss() {
    const ddd = [
        {
            name: "narayan"
        },
        {
            name: "narayan"
        },
    ]
    fs.writeFileSync("output.json", JSON.stringify(ddd))
}
writeFss()