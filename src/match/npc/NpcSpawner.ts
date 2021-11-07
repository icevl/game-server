import dayjs from "dayjs"
import { IBroadcast, EventType } from "@/interfaces/match/match.interface"
import { Session } from "../Session"
import { IMapSpawnNPC } from "@interfaces/maps-spawns-npcs.interface"

export class NpcSpawner {
  private spawn: IMapSpawnNPC
  private broadcast: IBroadcast
  private session: Session

  private mainLoopInterval: NodeJS.Timer
  private spawnLoopInterval: NodeJS.Timer

  private isSpawning: boolean

  constructor(session: Session, broadcast: IBroadcast, spawn: IMapSpawnNPC) {
    this.spawn = spawn
    this.session = session
    this.broadcast = broadcast
    this.isSpawning = false
    this.start()
  }

  private start() {
    this.mainLoopInterval = setInterval(() => this.mainLoop(), 1000)
  }

  private get interval() {
    return this.spawn.duration / this.spawn.amount
  }

  private mainLoop() {
    const stageDuration = dayjs().diff(dayjs(this.session.map.stageStartedAt), "seconds")

    if (stageDuration >= this.spawn.from_sec + this.spawn.duration && this.isSpawning) {
      clearInterval(this.mainLoopInterval)
      clearInterval(this.spawnLoopInterval)

      this.mainLoopInterval = null
      this.spawnLoopInterval = null

      this.isSpawning = false
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
    const { npc } = this.spawn

    const data = {
      character: this.spawn.npc.model,
      name: `npc_${npc.name}_${Math.round(Math.random() * 10000)}`,
      attack_target: this.getEnemy(),
      config: {
        name: npc.name,
        health: npc.health,
        move_speed: npc.move_speed,
        attack_speed: npc.attack_speed,
        attack_distance: npc.attack_distance,
        attack: npc.attack,
        defence: npc.defence
      }
    }

    this.broadcast({ type: EventType.SpawnNPC, data })
  }

  private getEnemy() {
    const players = this.session.players
    return players[Math.floor(Math.random() * players.length)].name
  }
}