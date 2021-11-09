import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMapSpawnNPCsGroup } from "@interfaces/maps-spawns-npcs-groups.interface"

export type NpcMapSpawnCreationAttributes = Optional<IMapSpawnNPCsGroup, "id" | "map_id" | "name">

export class MapsSpawnsNPCsGroupsModel
  extends Model<IMapSpawnNPCsGroup, NpcMapSpawnCreationAttributes>
  implements IMapSpawnNPCsGroup
{
  public id: number
  public map_id: number
  public name: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.belongsTo(models.Maps, { foreignKey: "map_id" })
    this.hasMany(models.MapsSpawnsNPCsPoints, { foreignKey: "group_id", as: "points" })
  }
}

export default function (sequelize: Sequelize): typeof MapsSpawnsNPCsGroupsModel {
  MapsSpawnsNPCsGroupsModel.init(
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
      name: {
        allowNull: false,
        type: DataTypes.STRING(50)
      }
    },
    {
      tableName: "maps_spawns_npcs_groups",
      sequelize
    }
  )

  return MapsSpawnsNPCsGroupsModel
}
