process.env["NODE_CONFIG_DIR"] = __dirname + "/configs"

import "dotenv/config"
import { v4 as uuidv4 } from "uuid"
import DB from "@databases"
import WebSocket, { EventEmitter } from "ws"

interface CustomSocket extends WebSocket {
  isAlive: boolean
  id: string
}

class Game {
  private wss: EventEmitter
  private port: number

  constructor(port: number) {
    this.port = port
    this.startServer()
    this.connectToDatabase()
    this.bindEvents()
  }

  private connectToDatabase() {
    DB.sequelize.sync({ force: false })
  }

  private startServer() {
    this.wss = new WebSocket.Server({ port: this.port })
    this.wss.on("listening", () => {
      console.log("Server started at port", this.port)
    })
  }

  private bindEvents() {
    this.wss.on("connection", this.handleConnection)

    setInterval(() => {
      // @ts-ignore
      this.wss.clients.forEach(client => {
        console.log("Client.ID: " + client.id)
      })
    }, 2000)
  }

  private handleConnection(socket: CustomSocket) {
    socket.id = uuidv4()

    console.log("Client connected: ", socket.id)

    socket.on("pong", () => (socket.isAlive = true))
    socket.on("message", data => {
      try {
        const payload = JSON.parse(data.toString())
        console.log("payload", payload)
      } catch {}
    })
  }
}

new Game(9090)
