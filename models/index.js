// require('dotenv').config();
const Sequelize = require("sequelize");

// Initialize the Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: process.env.DB_DIALECT || "postgres",
        logging: false,
    }
);

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));

// Exporting sequelize instance and Sequelize constructor
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
