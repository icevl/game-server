import { Sequelize, DataTypes, Model, Optional } from "sequelize"
import { IUser } from "@interfaces/users.interface"

export type UserCreationAttributes = Optional<IUser, "id" | "email" | "password">

export class UserModel extends Model<IUser, UserCreationAttributes> implements IUser {
  public id: number
  public email: string
  public password: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  static associate() {}
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45)
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255)
      }
    },
    {
      tableName: "users",
      indexes: [
        {
          unique: true,
          fields: ["email"]
        }
      ],
      sequelize
    }
  )

  return UserModel
}
