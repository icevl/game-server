export enum MatchType {
  Coop = 1,
  PVP = 2
}

export interface IMatch {
  id: number
  type: MatchType
  uuid: string
  host: string
  port: number
}
