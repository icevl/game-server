import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { INPC } from "@interfaces/npcs.interface"

export type NpcCreationAttributes = Optional<INPC, "id" | "name" | "health">

export class NPCsModel extends Model<INPC, NpcCreationAttributes> implements INPC {
  public id: number
  public model: string
  public name: string
  public health: number
  public move_speed: number
  public attack_speed: number
  public attack_distance: number
  public attack: number
  public defence: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate(models) {
    this.hasMany(models.MapsSpawnsNPCs, { foreignKey: "npc_id", as: "spawns" })
  }
}

export default function (sequelize: Sequelize): typeof NPCsModel {
  NPCsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      model: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      health: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      move_speed: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.DECIMAL
      },
      attack_speed: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      attack_distance: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.DECIMAL
      },
      attack: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      defence: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "npcs",
      sequelize
    }
  )

  return NPCsModel
}
