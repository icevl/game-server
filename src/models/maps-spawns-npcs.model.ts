import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMapSpawnNPC } from "@interfaces/maps-spawns-npcs.interface"

export type NpcCreationAttributes = Optional<IMapSpawnNPC, "id" | "map_id" | "stage">

export class MapsSpawnsNPCsModel extends Model<IMapSpawnNPC, NpcCreationAttributes> implements IMapSpawnNPC {
  public id: number
  public map_id: number
  public stage: number
  public from_sec: number
  public duration: number
  public amount: number
  public npc_id: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.belongsTo(models.NPCs, { foreignKey: "npc_id", as: "npc" })
    this.belongsTo(models.Maps, { foreignKey: "map_id" })
  }
}

export default function (sequelize: Sequelize): typeof MapsSpawnsNPCsModel {
  MapsSpawnsNPCsModel.init(
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
      stage: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      from_sec: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      duration: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      amount: {
        allowNull: false,
        defaultValue: 1,
        type: DataTypes.INTEGER
      },
      npc_id: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "maps_spawns_npcs",
      sequelize
    }
  )

  return MapsSpawnsNPCsModel
}
