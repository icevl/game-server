import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMapBlock } from "@interfaces/maps-blocks.interface"
import { MapsBlocksGroupsModel } from "./maps-blocks-groups.model"

export type MapCreationAttributes = Optional<IMapBlock, "id" | "name" | "capacity" | "group_id">

export class MapsBlocksModel extends Model<IMapBlock, MapCreationAttributes> implements IMapBlock {
  public id: number
  public name: string
  public capacity: number
  public group_id: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.belongsTo(models.MapsBlocksGroups, { foreignKey: "group_id" })
  }
}

export default function (sequelize: Sequelize): typeof MapsBlocksModel {
  MapsBlocksModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      group_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      capacity: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "maps_blocks",
      indexes: [
        {
          fields: ["group_id", "name"],
          using: "BTREE"
        }
      ],

      sequelize
    }
  )

  return MapsBlocksModel
}
