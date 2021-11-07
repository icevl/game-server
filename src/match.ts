process.env["NODE_CONFIG_DIR"] = __dirname + "/configs"

import "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import DB from "@databases"
import WebSocket, { EventEmitter } from "ws"
import { Map } from "./match/Map"
import MatchesService from "./services/matches.service"
import { Processor } from "./match/Processor"
import { Session } from "./match/Session"

export interface ICustomSocket extends WebSocket {
  isAlive: boolean
  id: string
  sendEvent: (payload: any) => void
}

class Match {
  private wss: EventEmitter
  private uuid: string

  private session: Session = new Session()
  private map: Map = new Map()
  private matchesService = new MatchesService()

  constructor(uuid: string) {
    this.uuid = uuid
    this.init()
  }

  private async init() {
    await DB.sequelize.sync({ force: false, alter: false })
    const match = await this.matchesService.findMatch(this.uuid)
    if (match && match.id) {
      const blocks = await this.map.getSpawnBlocks(match.map_id)

      this.session.setBlocks(blocks)
      this.session.setMatch(match)

      this.startServer()
    }
  }

  private startServer() {
    this.wss = new WebSocket.Server({ port: this.session.match.port })
    this.wss.on("listening", () => {
      console.log("Server started at port", this.session.match.port)
    })
    this.wss.on("connection", (socket: ICustomSocket) => this.handleConnection(socket))

    // setInterval(() => {
    //   // @ts-ignore
    //   this.wss.clients.forEach(client => {
    //     console.log("Client.ID: " + client.id)
    //   })
    // }, 2000)
  }

  private handleConnection(socket: ICustomSocket) {
    socket.id = uuidv4()

    socket.sendEvent = (payload: any) => {
      socket.send(JSON.stringify(payload))
    }

    socket.on("pong", () => (socket.isAlive = true))
    socket.on("message", data => {
      const payload = JSON.parse(data.toString())
      new Processor(socket, this.session).process(payload)
    })
  }
}

new Match("9b8203e4-3cf4-423e-bae5-2cc7316134b7")
