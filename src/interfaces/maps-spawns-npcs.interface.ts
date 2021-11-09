import { INPC } from "./npcs.interface"

export interface IMapSpawnNPC {
  id: number
  map_id: number
  stage: number
  from_sec: number
  duration: number
  amount: number
  npc_id: number
  group_id: number
  npc?: INPC
}
