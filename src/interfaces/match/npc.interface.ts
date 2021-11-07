export interface INPCSpawns {
  [key: number]: any
}

export interface SpawnedNPC {
  character: string
  name: string
  attack_target: string
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
