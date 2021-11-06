import { ICharacter } from "../characters.interface"
import { IUser } from "@interfaces/users.interface"

export interface IEvent<T> {
  type: EventType
  data: T
}

export interface IEventConnect {
  user_id: number
  match: string
}

export interface IPlayer {
  character: ICharacter
  user: IUser
  name: string
  sessionId: string
}

export enum EventType {
  Connect = "connect",
  SpawnBlocks = "spawn_blocks",
  SpawnBlocksComplete = "spawn_blocks_complete",
  SpawnPlayer = "spawn_player"
}
