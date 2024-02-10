const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Contact', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    phonenumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "Contact_email_phonenumber_key"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "Contact_email_phonenumber_key"
    },
    linkedid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    linkprecedence: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    deletedat: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Contact',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Contact_email_phonenumber_key",
        unique: true,
        fields: [
          { name: "email" },
          { name: "phonenumber" },
        ]
      },
      {
        name: "Contact_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
