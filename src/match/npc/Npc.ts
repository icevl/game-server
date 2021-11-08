import { IMapSpawnNPC } from "@interfaces/maps-spawns-npcs.interface"
import { SpawnedNPC } from "@interfaces/match/npc.interface"
import { IBroadcast, EventType } from "@interfaces/match/match.interface"

interface NPCConfig {
  name: string
  health: number
  move_speed: number
  attack_speed: number
  attack_distance: number
  attack: number
  defence: number
}

export class Npc {
  private spawn: IMapSpawnNPC
  private broadcast: IBroadcast

  public character: string
  public name: string
  public attack_target: string
  public current_health: number
  public config: Partial<NPCConfig> = {}

  private isScream: boolean = false

  constructor(spawn: IMapSpawnNPC, broadcast: IBroadcast, attackTarget: string) {
    const { npc } = spawn

    this.spawn = spawn
    this.broadcast = broadcast

    this.character = npc.model
    this.name = `npc_${npc.name}_${Math.round(Math.random() * 10000)}`
    this.attack_target = attackTarget
    this.current_health = spawn.npc.health
    this.config = {
      name: npc.name,
      health: npc.health,
      move_speed: npc.move_speed,
      attack_speed: npc.attack_speed,
      attack_distance: npc.attack_distance,
      attack: npc.attack,
      defence: npc.defence
    }

    this.call()
  }

  public get data(): SpawnedNPC {
    return {
      character: this.character,
      name: this.name,
      attack_target: this.attack_target,
      current_health: this.current_health,
      config: this.config as NPCConfig
    }
  }

  public getDamage(damage: number) {
    this.current_health -= damage

    if (!this.isScream && this.current_health <= this.config.health / 2) {
      this.isScream = true
      this.broadcast({ type: EventType.NPCScream, data: { character: this.name } })
    }

    if (this.current_health < 0) this.current_health = 0
  }

  private call() {}
}
