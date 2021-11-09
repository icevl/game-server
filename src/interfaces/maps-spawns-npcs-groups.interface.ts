import { IMapSpawnNPCPoint } from "./maps-spawns-npcs-points.interface"

export interface IMapSpawnNPCsGroup {
  id: number
  map_id: number
  name: string
}

export interface IMapNPCSpawnGroup extends IMapSpawnNPCsGroup {
  points?: Array<IMapSpawnNPCPoint>
}
