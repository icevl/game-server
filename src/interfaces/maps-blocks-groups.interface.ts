import { IMapBlock } from "./maps-blocks.interface"

export interface IMapBlockGroup {
  id: number
  title: string
  map_id: number
  side: string
}

export interface IGroups {
  title: string
  blocks: Array<Partial<IMapBlock>>
}
