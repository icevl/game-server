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
  shooter: string
}

export interface IEventChangeHealth {
  character: string
  health: number
}

export interface IEventNPCAttackDamage {
  character: string
  target: string
}

export interface IEventCharacterSetDestination {
  character: string
  waypoint: string
}

export interface IEventCharacterSetRotation {
  character: string
  root: {
    x: number
    y: number
    z: number
  }
  body: {
    x: number
    y: number
    z: number
  }
}

export interface IEventShoot {
  character: string
  dst: {
    x: number
    y: number
    z: number
  }
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
  Ping = "ping",
  Pong = "pong",
  SpawnBlocks = "spawn_blocks",
  SpawnBlocksComplete = "spawn_blocks_complete",
  SpawnPlayer = "spawn_player",
  SpawnNPC = "spawn_npc",
  NPCScream = "npc_scream",
  NPCDie = "npc_die",
  NPCAgro = "npc_agro",
  NPCAttackDamage = "npc_attack_damage",
  CharacterChangeHealth = "character_change_health",
  SetSpawnGroup = "set_group",
  HoldSpawnPoint = "hold_spawn_point",
  Damage = "damage",
  BotAttackStart = "bot_attack_start",
  BotAttackStop = "bot_attack_stop",
  SetMasterPlayer = "set_master_player",
  MissionText = "mission_text",
  SetCharacterDestination = "set_destination",
  SetCharacterRotation = "set_rotation",
  SetCharacterAim = "character_aim",
  EquipWeapon = "equip_weapon",
  ReloadingStart = "reloading_start",
  ShootStart = "shoot_start",
  CharacterSit = "character_sit",
  ShootStop = "shoot_stop",
  Shoot = "shoot"
}

export type IBroadcast = (event: IEvent<any>) => void
