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
  type: "coop" | "pvp"
  stage: number
  stageStartedAt: Date | null
  startGroupId?: number // only for coop map
}
