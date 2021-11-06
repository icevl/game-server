import { ICharacter } from "@interfaces/characters.interface"
import { IUser } from "@interfaces/users.interface"

export interface IMatchSession {
  id: number
  match_id: number
  character_id: number
  character?: ICharacter
  user?: IUser
}
