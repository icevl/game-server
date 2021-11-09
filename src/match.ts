process.env["NODE_CONFIG_DIR"] = __dirname + "/configs"

import "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"
import DB from "@databases"
import WebSocket, { EventEmitter } from "ws"
import { IEvent } from "@/interfaces/match/match.interface"
import { Map } from "./match/Map"
import MatchesService from "./services/matches.service"
import MapsService from "./services/maps.service"
import NPCService from "./services/npc.service"
import { Processor } from "./match/Processor"
import { Session } from "./match/Session"
import { Bot } from "./match/Bot"
import { NpcMachine } from "./match/npc/NpcMachine"

export interface ICustomSocket extends WebSocket {
  isAlive: boolean
  id: string
  sendEvent: (payload: any) => void
  sendToOthers: (payload: any) => void
}

class Match {
  private wss: EventEmitter
  private uuid: string

  private session: Session = new Session()
  private map: Map = new Map(this.session)
  private bot: Bot = new Bot(this.session, this.broadcast.bind(this))
  private npcMachine: NpcMachine = new NpcMachine(this.session, this.broadcast.bind(this))
  private matchesService = new MatchesService()
  private mapsService = new MapsService()
  private npcService = new NPCService()

  constructor(uuid: string) {
    this.uuid = uuid
    this.init()
  }

  private async init() {
    await DB.sequelize.sync({ force: false, alter: true })
    const match = await this.matchesService.findMatch(this.uuid)
    if (match && match.id) {
      const blocks = await this.map.getSpawnBlocks(match.map_id)
      const mapResponse = await this.mapsService.findMapById(match.map_id)

      const npcSpawnPoints = {}
      let stagesCount = 1

      if (mapResponse.type === "coop") {
        stagesCount = await this.npcService.stagesCount(match.map_id)

        // Map NPC spawn points hash
        const npcMapGroups = await this.npcService.findSpawnsPoints(match.map_id)
        npcMapGroups.forEach(group => {
          npcSpawnPoints[group.id] = { name: group.name, points: [] }
          group.points.forEach(point => {
            npcSpawnPoints[group.id].points.push(point.name)
          })
        })
      }

      this.session.setMapData({
        blocks,
        stagesCount,
        npcSpawnPoints,
        type: mapResponse.type,
        startGroupId: mapResponse.start_group_id,
        stage: 1,
        stageStartedAt: null
      })

      this.session.setMatch(match)

      await this.bot.addBots()
      this.npcMachine.start()

      this.startServer()
      this.waitForBegin()
    }
  }

  private startServer() {
    this.wss = new WebSocket.Server({ port: this.session.match.port })
    this.wss.on("listening", () => {
      console.log("Server started at port", this.session.match.port)
    })
    this.wss.on("connection", (socket: ICustomSocket) => this.handleConnection(socket))
  }

  private handleConnection(socket: ICustomSocket) {
    socket.id = uuidv4()

    socket.sendEvent = (payload: any) => {
      socket.send(JSON.stringify(payload))
    }

    socket.sendToOthers = (payload: any) => {
      this.sendToOthers(socket.id, payload)
    }

    socket.on("pong", () => (socket.isAlive = true))
    socket.on("message", data => {
      const payload = JSON.parse(data.toString())
      new Processor(socket, this.session, this.bot).process(payload)
    })
  }

  private broadcast(payload: IEvent<any>) {
    // @ts-ignore
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify(payload))
    })
  }

  private sendToOthers(sessionId: string, payload: IEvent<any>) {
    // @ts-ignore
    this.wss.clients
      .filter(client => client.id !== sessionId)
      .forEach(client => {
        client.send(JSON.stringify(payload))
      })
  }

  private async waitForBegin() {
    const isAllReady = await this.map.isAllPlayersReady()
    if (!isAllReady) {
      console.log("Waiting for players for match start")
      setTimeout(() => this.waitForBegin(), 2000)
    } else {
      console.log("Starting match...")

      this.session.map.stage = 1
      this.session.map.stageStartedAt = dayjs().toDate()
    }
  }
}

new Match("9b8203e4-3cf4-423e-bae5-2cc7316134b7")
