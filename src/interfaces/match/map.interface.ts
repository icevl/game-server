import { IMapNPCSpawnGroup } from "@interfaces/maps-spawns-npcs-groups.interface"

export interface IMapBlockGroup {
  group: string
  blocks: Array<IBlock>
}

export interface IBlock {
  name: string
  capacity: number
}

export interface IMapBlockResponse {
  name: string
  points: Array<string>
}

export interface NPCSpawnPoints {
  [group: number]: {
    name: string
    points: Array<string>
  }
}

export interface IMap {
  blocks: Array<IMapBlockResponse>
  type: "coop" | "pvp"
  stage: number
  stagesCount: number
  stageStartedAt: Date | null
  npcSpawnPoints?: NPCSpawnPoints
  startGroupId?: number // only for coop map
}
