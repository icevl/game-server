import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMapSpawnNPCPoint } from "@interfaces/maps-spawns-npcs-points.interface"

export type NpcMapSpawnCreationAttributes = Optional<IMapSpawnNPCPoint, "id" | "group_id" | "name">

export class MapsSpawnsNPCsPointsModel
  extends Model<IMapSpawnNPCPoint, NpcMapSpawnCreationAttributes>
  implements IMapSpawnNPCPoint
{
  public id: number
  public group_id: number
  public name: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.belongsTo(models.MapsSpawnsNPCsGroups, { foreignKey: "group_id" })
  }
}

export default function (sequelize: Sequelize): typeof MapsSpawnsNPCsPointsModel {
  MapsSpawnsNPCsPointsModel.init(
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
        type: DataTypes.STRING(50)
      }
    },
    {
      tableName: "maps_spawns_npcs_points",
      sequelize
    }
  )

  return MapsSpawnsNPCsPointsModel
}
