import dayjs from "dayjs"
import { IVector3 } from "@interfaces/characters.interface"
import { EventType } from "@interfaces/match/match.interface"
import { Session } from "./Session"
import { Map } from "./Map"
import { Player } from "./Player"

export class Drone {
  private mapHandler: Map
  private session: Session

  public name: string
  public character: Player
  public position: IVector3
  public rate: number
  public attack: number
  public duration: number
  public spawnedAt: number

  public attackTo?: string

  private loopInterval: NodeJS.Timer

  constructor(session: Session) {
    this.mapHandler = new Map(session)
    this.session = session
  }

  public create(character: Player) {
    this.character = character
    this.name = `drone_${character.character.id}_${dayjs().unix()}`
    this.spawnedAt = dayjs().unix()
    this.position = character.position
    this.rate = 400
    this.attack = 50
    this.duration = 300
    this.attackTo = this.getRandomEnemy()

    this.loopInterval = setInterval(() => this.loop(), 1000)
    setTimeout(() => this.destroy(), this.duration * 1000)
    this.broadcastEvent()

    return this
  }

  public get spawnData() {
    return {
      type: EventType.DroneSpawn,
      data: {
        name: this.name,
        character: this.character.name,
        position: this.position,
        attack: this.attack,
        rate: this.rate,
        duration: this.spawnedAt + this.duration - dayjs().unix(),
        target: this.attackTo
      }
    }
  }

  private destroy() {
    clearInterval(this.loopInterval)
    this.session.removeDrone(this)
  }

  private broadcastEvent() {
    this.session.broadcast(this.spawnData)
  }

  private loop() {
    if (this.attackTo) {
      const enemy = this.session.getNPCByName(this.attackTo)
      if (enemy.currentHealth <= 0) this.attackTo = null
    }

    if (!this.attackTo) {
      this.attackTo = this.getRandomEnemy()
      if (this.attackTo)
        this.session.broadcast({ type: EventType.DroneAttack, data: { drone: this.name, target: this.attackTo } })
    }
  }

  private getRandomEnemy(): string {
    const aliveNPCs = this.session.npcs.filter(npc => npc.currentHealth > 0)
    if (aliveNPCs.length) {
      return aliveNPCs[0].name
    }

    return ""
  }
}
