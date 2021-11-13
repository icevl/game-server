import dayjs from "dayjs"
import { EventType } from "@interfaces/match/match.interface"
import { Session } from "../Session"
import { IMapSpawnNPC } from "@interfaces/maps-spawns-npcs.interface"

import { Npc } from "./Npc"

const MAX_NPCS_PER_CHARACTER = 3

export class NpcSpawner {
  public spawn: IMapSpawnNPC
  private session: Session

  private spawnedCount = 0
  private mainLoopInterval: NodeJS.Timer
  private spawnLoopInterval: NodeJS.Timer

  private isSpawning: boolean
  public isComplete: boolean

  constructor(session: Session, spawn: IMapSpawnNPC) {
    this.spawn = spawn
    this.session = session
    this.isSpawning = false
    this.isComplete = false
    this.start()
  }

  private start() {
    this.mainLoopInterval = setInterval(() => this.mainLoop(), 1000)
  }

  private get interval() {
    return this.spawn.duration / this.totalAmount
  }

  private get totalAmount() {
    return this.spawn.amount * this.session.players.length
  }

  private mainLoop() {
    const stageDuration = dayjs().diff(dayjs(this.session.map.stageStartedAt), "seconds")

    if (this.isSpawning && this.spawnedCount === this.totalAmount) {
      clearInterval(this.mainLoopInterval)
      clearInterval(this.spawnLoopInterval)

      this.mainLoopInterval = null
      this.spawnLoopInterval = null

      this.isSpawning = false
      this.isComplete = true
      console.log("Stop spawn", this.spawn.npc.name)
      return
    }

    if (this.session.map.stage !== this.spawn.stage) return
    if (this.spawn.from_sec > stageDuration) return

    if (!this.isSpawning) {
      const spawnInterval = this.interval * 1000
      this.isSpawning = true
      this.spawnLoopInterval = setInterval(() => this.spawnLoop(), spawnInterval)
      console.log(`Start spawn [${this.spawn.npc.name}] 1 per. ${this.interval}sec.`)
    }
  }

  private spawnLoop() {
    const npcsCurrentAmount = this.session.getLiveNPCs()
    if (npcsCurrentAmount.length >= MAX_NPCS_PER_CHARACTER * this.session.players.length) return

    const npc = new Npc(this.session, this.spawn)

    this.session.addNPC(npc)
    this.session.broadcast({ type: EventType.SpawnNPC, data: npc.data })

    this.spawnedCount++
    console.log(`[SPAWN]: ${npc.config.name} to ${npc.spawnPoint}`)
  }
}
