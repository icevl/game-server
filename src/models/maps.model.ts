import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IMap } from "@interfaces/maps.interface"

export type MapCreationAttributes = Optional<IMap, "id" | "title">

export class MapsModel extends Model<IMap, MapCreationAttributes> implements IMap {
  public id: number
  public title: string
  public start_group_id: number
  public type: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate() {}
}

export default function (sequelize: Sequelize): typeof MapsModel {
  MapsModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      type: {
        allowNull: false,
        defaultValue: "coop",
        type: DataTypes.STRING(20)
      },
      start_group_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: "maps",
      sequelize
    }
  )

  return MapsModel
}
