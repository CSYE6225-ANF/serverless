const db = require('./index');
const { DataTypes } = require('sequelize');

const EmailLog = db.sequelize.define('EmailLog', {
    email_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    verificationLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Sent', 'Failed'), // Enum for defined status options
        allowNull: false,
        defaultValue: 'Pending'
    },
    errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Log the exact time the email was recorded
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'email_log',
    timestamps: true, // Use createdAt and updatedAt
});

module.exports = EmailLog;
