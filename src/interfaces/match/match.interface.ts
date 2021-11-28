import { ICharacter, IVector3 } from "../characters.interface"
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
  root: IVector3
  body: IVector3
}

export interface IEventShoot {
  character: string
  dst: IVector3
}

export interface IEventHoldSpawnPoint {
  character: string
  point: string
  position: IVector3
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
  NPCTargetReached = "npc_target_reached",
  NPCTargetFollow = "npc_target_follow",
  NPCAttack = "npc_attack",
  DroneSpawn = "drone_spawn",
  DroneAttack = "drone_attack",
  CharacterChangeHealth = "character_change_health",
  CharacterHealRequest = "character_heal_request",
  CharacterDroneRequest = "character_drone_request",
  SetSpawnGroup = "set_group",
  HoldSpawnPoint = "hold_spawn_point",
  Damage = "damage",
  BotAttackStart = "bot_attack_start",
  BotAttackStop = "bot_attack_stop",
  SetMasterPlayer = "set_master_player",
  MissionText = "mission_text",
  SetCharacterDestination = "set_destination",
  SetCharacterRotation = "set_rotation",
  SetCharacterPosition = "set_position",
  SetCharacterAim = "character_aim",
  EquipWeapon = "equip_weapon",
  ReloadingStart = "reloading_start",
  ShootStart = "shoot_start",
  CharacterSit = "character_sit",
  ShootStop = "shoot_stop",
  CharacterMatchScore = "character_match_score",
  Shoot = "shoot"
}

export type IBroadcast = (event: IEvent<any>) => void
