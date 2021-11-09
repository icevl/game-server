import config from "config"
import Sequelize from "sequelize"
import { dbConfig } from "@interfaces/db.interface"
import UserModel from "@models/users.model"
import CharacterModel from "@models/characters.model"
import MatchModel from "@models/matches.model"
import MatchesSessionsModel from "@models/matches-sessions.model"
import MapModel from "@models/maps.model"
import MapsBlocksGroupsModel from "@models/maps-blocks-groups.model"
import MapsBlocksModel from "@models/maps-blocks.model"
import NPCsModel from "@models/npcs.model"
import MapsSpawnsNPCsModel from "@models/maps-spawns-npcs.model"
import MapsSpawnsNPCsGroupsModel from "@models/maps-spawns-npcs-groups.model"
import MapsSpawnsNPCsPointsModel from "@models/maps-spawns-npcs-points.model"

import { logger } from "@utils/logger"

const { host, user, password, database, pool }: dbConfig = config.get("dbConfig")
const sequelize = new Sequelize.Sequelize(database, user, password, {
  host: host,
  dialect: "postgres",
  timezone: "+09:00",
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: true,
    freezeTableName: true
  },
  pool: {
    min: pool.min,
    max: pool.max
  },
  logQueryParameters: process.env.NODE_ENV === "development",
  logging: (query, time) => {
    //logger.info(time + "ms" + " " + query)
  },
  benchmark: true
})

sequelize.authenticate()

const models = {
  Users: UserModel(sequelize),
  Characters: CharacterModel(sequelize),
  Matches: MatchModel(sequelize),
  Maps: MapModel(sequelize),
  MapsBlocksGroups: MapsBlocksGroupsModel(sequelize),
  MapsBlocks: MapsBlocksModel(sequelize),
  MatchesSessions: MatchesSessionsModel(sequelize),
  NPCs: NPCsModel(sequelize),
  MapsSpawnsNPCs: MapsSpawnsNPCsModel(sequelize),
  MapsSpawnsNPCsGroups: MapsSpawnsNPCsGroupsModel(sequelize),
  MapsSpawnsNPCsPoints: MapsSpawnsNPCsPointsModel(sequelize)
}

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models))

const DB = {
  ...models,
  sequelize, // connection instance (RAW queries)
  Sequelize // library
}

export default DB
