export enum MatchType {
  Coop = 1,
  PVP = 2
}

export interface IMatch {
  id: number
  type: MatchType
  map_id: number
  uuid: string
  host: string
  port: number
}
