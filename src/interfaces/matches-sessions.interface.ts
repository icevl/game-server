import { ICharacter } from "@interfaces/characters.interface"
import { IUser } from "@interfaces/users.interface"

export type ISide = "a" | "b"

export interface IMatchSession {
  id: number
  match_id: number
  character_id: number
  side: ISide
  is_master: boolean
  character?: ICharacter
  user?: IUser
}
