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

export interface IMap {
  blocks: Array<IMapBlockResponse>
}
