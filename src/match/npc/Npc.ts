import { IMapSpawnNPC } from "@interfaces/maps-spawns-npcs.interface"
import { SpawnedNPC } from "@interfaces/match/npc.interface"
import { EventType } from "@interfaces/match/match.interface"
import { Session } from "../Session"

export enum State {
  Idle,
  Moving,
  Attack
}

interface NPCConfig {
  name: string
  health: number
  move_speed: number
  attack_speed: number
  attack_distance: number
  attack: number
  defence: number
  is_boss: boolean
  level: number
}

export class Npc {
  private session: Session
  private spawn: IMapSpawnNPC

  private loopInterval: NodeJS.Timer

  public spawnPoint: string
  public character: string
  public name: string
  public attackTarget: string
  public currentHealth: number
  public config: Partial<NPCConfig> = {}

  private isScream: boolean = false

  // Boss
  public isTargetReached: boolean
  public state: State

  constructor(session: Session, spawn: IMapSpawnNPC) {
    const { npc } = spawn
    const spawnGroup = session.map.npcSpawnPoints[spawn.group_id]

    this.session = session
    this.spawn = spawn

    this.character = npc.model
    this.name = `npc_${npc.name}_${Math.round(Math.random() * 10000)}`
    this.attackTarget = this.getEnemy()
    this.currentHealth = spawn.npc.health
    this.spawnPoint = `${spawnGroup.name}__${spawnGroup.points[Math.floor(Math.random() * spawnGroup.points.length)]}`
    this.config = {
      name: npc.name,
      health: npc.health,
      move_speed: npc.move_speed,
      attack_speed: npc.attack_speed,
      attack_distance: npc.attack_distance,
      attack: npc.attack,
      defence: npc.defence,
      is_boss: npc.is_boss,
      level: npc.attack
    }

    this.isTargetReached = false
    this.state = State.Idle

    this.call()
  }

  public get data(): SpawnedNPC {
    return {
      character: this.character,
      name: this.name,
      attack_target: this.attackTarget,
      current_health: this.currentHealth,
      spawn_point: this.spawnPoint,
      config: this.config as NPCConfig
    }
  }

  public takeDamage(damage: number) {
    this.currentHealth -= damage

    if (!this.isScream && this.currentHealth <= this.config.health / 2) {
      this.isScream = true
      this.scream()
    }

    if (this.currentHealth <= 0) {
      this.currentHealth = 0
      this.session.broadcast({ type: EventType.NPCDie, data: { character: this.name } })
      this.destroy()
    }
  }

  public getEnemy() {
    try {
      const players = this.session.getOnlinePlayers().filter(player => player.currentHealth > 0)
      return players[Math.floor(Math.random() * players.length)].name
    } catch {
      return null
    }
  }

  public scream() {
    this.session.broadcast({ type: EventType.NPCScream, data: { character: this.name } })
  }

  // Boss
  public startMoving(toPlayer?: boolean) {
    this.state = State.Moving

    if (toPlayer) {
      this.attackTarget = this.getEnemy()
      this.session.broadcast({
        type: EventType.NPCTargetFollow,
        data: { character: this.name, target: this.attackTarget }
      })
    }
  }

  public attack() {
    this.state = State.Attack
    this.session.broadcast({
      type: EventType.NPCAttack,
      data: { character: this.name, target: this.getEnemy() }
    })
  }

  public targetReached() {
    this.state = State.Idle
  }

  private call() {
    this.loopInterval = setInterval(() => this.loop(), 1000)

    if (this.config.is_boss) setInterval(() => this.attack(), this.config.attack_speed * 1000)
  }

  private loop() {
    this.checkTargetIsOnline()
  }

  private checkTargetIsOnline() {
    if (this.attackTarget) {
      const targetCharacter = this.session.getPlayerByName(this.attackTarget)
      if (!targetCharacter.isOnline) {
        this.attackTarget = this.getEnemy()
      }
    }
  }

  private destroy() {
    clearInterval(this.loopInterval)
  }
}
