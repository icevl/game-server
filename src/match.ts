process.env["NODE_CONFIG_DIR"] = __dirname + "/configs"

import "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import DB from "@databases"
import WebSocket, { EventEmitter } from "ws"
import MatchesService from "./services/matches.service"
import { IMatch } from "./interfaces/matches.interface"
import { Processor } from "./match/Processor"

export interface CustomSocket extends WebSocket {
  isAlive: boolean
  id: string
}

class Match {
  private wss: EventEmitter
  private uuid: string
  private match: IMatch
  private matchesService = new MatchesService()

  constructor(uuid: string) {
    this.uuid = uuid
    this.init()
  }

  private async init() {
    await DB.sequelize.sync({ force: false, alter: true })
    const match = await this.matchesService.findMatch(this.uuid)
    if (match.id) {
      this.match = match
      this.startServer()
    }
  }

  private startServer() {
    this.wss = new WebSocket.Server({ port: this.match.port })
    this.wss.on("listening", () => {
      console.log("Server started at port", this.match.port)
    })
    this.wss.on("connection", (socket: CustomSocket) => this.handleConnection(socket))

    // setInterval(() => {
    //   // @ts-ignore
    //   this.wss.clients.forEach(client => {
    //     console.log("Client.ID: " + client.id)
    //   })
    // }, 2000)
  }

  private handleConnection(socket: CustomSocket) {
    socket.id = uuidv4()

    console.log("Client connected: ", socket.id)

    socket.on("pong", () => (socket.isAlive = true))
    socket.on("message", data => {
      const payload = JSON.parse(data.toString())
      new Processor(socket, this.match).process(payload)
    })
  }
}

new Match("9b8203e4-3cf4-423e-bae5-2cc7316134b7")
