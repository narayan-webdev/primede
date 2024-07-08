export async function getConfigs(subdomain, sequelize) {
    try {
        const { Sequelize, DataTypes } = require('sequelize');
        const mainDbConfig = require('../../config/db.config');
        const user = require('../api/user2/models/user')(sequelize);

        const config = await user.findOne({ where: { subdomain: subdomain } });
        return config;

    } catch (error) {
        return error;
    }
}