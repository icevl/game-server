import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import DB from "@databases"
import { IMapBlockGroup } from "@interfaces/maps-blocks-groups.interface"
import { MapsModel } from "./maps.model"
import { MapsBlocksModel } from "./maps-blocks.model"

export type MapCreationAttributes = Optional<IMapBlockGroup, "id" | "title" | "map_id">

export class MapsBlocksGroupsModel extends Model<IMapBlockGroup, MapCreationAttributes> implements IMapBlockGroup {
  public id: number
  public title: string
  public map_id: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.hasMany(models.MapsBlocks, { as: "blocks", foreignKey: "group_id" })
  }
}

export default function (sequelize: Sequelize): typeof MapsBlocksGroupsModel {
  MapsBlocksGroupsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      map_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(100)
      }
    },
    {
      tableName: "maps_blocks_groups",
      indexes: [
        {
          fields: ["map_id"],
          using: "BTREE"
        }
      ],

      sequelize
    }
  )

  // MapsBlocksGroupsModel.belongsTo(MapsModel, {
  //   foreignKey: "map_id",
  //   as: "map"
  // })

  // MapsBlocksGroupsModel.hasMany(DB.MapsBlocks, {
  //   as: "blocks",
  //   foreignKey: "group_id"
  // })

  return MapsBlocksGroupsModel
}
