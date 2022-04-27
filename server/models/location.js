"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Study }) {
      // define association here
      this.hasMany(Study, { foreignKey: "location_id", as: "study" });
    }

    toJSON() {
      return { ...this.get(), password: undefined };
    }
  }
  Location.init(
    {
      name: DataTypes.STRING,
      roadAddress: DataTypes.STRING,
      latitude: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: `latitude not allowed null` },
          notEmpty: { msg: `latitude must not be empty` },
        },
      },
      longitude: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: `latitude not allowed null` },
          notEmpty: { msg: `latitude must not be empty` },
        },
      },
      city: DataTypes.STRING,
      guType: DataTypes.STRING,
      dongType: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: "location",
      modelName: "Location",
    }
  );
  return Location;
};