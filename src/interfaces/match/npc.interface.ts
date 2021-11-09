import { NpcSpawner } from "../../match/npc/NpcSpawner"

export interface INPCSpawns {
  [key: number]: NpcSpawner
}

export interface SpawnedNPC {
  character: string
  name: string
  attack_target: string
  current_health: number
  spawn_point: string
  config: {
    name: string
    health: number
    move_speed: number
    attack_speed: number
    attack_distance: number
    attack: number
    defence: number
  }
}
