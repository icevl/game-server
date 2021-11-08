import { ICharacter } from "../characters.interface"
import { IUser } from "@interfaces/users.interface"

export interface IEvent<T> {
  type: EventType
  data: T
}

export interface IEventConnect {
  character_id: number
  match: string
}

export interface IEventDamage {
  character: string
  damage: number
  damage_type: number
}

export interface IEventHoldSpawnPoint {
  character: string
  point: string
}

export interface IPlayer {
  character: ICharacter
  user: IUser
  name: string
  spawn: string
  group: string | null
  isReady: boolean
  isMaster: boolean
  sessionId: string
  attackTo?: string
}

export enum EventType {
  Connect = "connect",
  SpawnBlocks = "spawn_blocks",
  SpawnBlocksComplete = "spawn_blocks_complete",
  SpawnPlayer = "spawn_player",
  SpawnNPC = "spawn_npc",
  NPCScream = "npc_scream",
  SetSpawnGroup = "set_group",
  HoldSpawnPoint = "hold_spawn_point",
  Damage = "damage",
  BotAttackStart = "bot_attack_start",
  BotAttackStop = "bot_attack_stop",
  SetMasterPlayer = "set_master_player"
}

export type IBroadcast = (event: IEvent<any>) => void
