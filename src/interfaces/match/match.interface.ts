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
  sessionId: string
}

export enum EventType {
  Connect = "connect",
  SpawnBlocks = "spawn_blocks",
  SpawnBlocksComplete = "spawn_blocks_complete",
  SpawnPlayer = "spawn_player",
  SpawnNPC = "spawn_npc",
  SetSpawnGroup = "set_group",
  HoldSpawnPoint = "hold_spawn_point"
}

export type IBroadcast = (event: IEvent<any>) => void
