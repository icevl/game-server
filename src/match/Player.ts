import { ICharacter } from "@interfaces/characters.interface"
import { IUser } from "@interfaces/users.interface"
import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import MatchesService from "@services/matches.service"
import { ICustomSocket } from "../match"
import { Session } from "./Session"
import { Map } from "./Map"

export class Player {
  private userService = new UserService()
  private characterService = new CharacterService()
  private matchesService = new MatchesService()
  private mapHandler: Map

  private session: Session

  public character: ICharacter
  public user: IUser
  public name: string
  public spawn: string
  public group: string | null
  public isReady: boolean
  public isMaster: boolean
  public sessionId: string
  public attackTo?: string
  public socket?: ICustomSocket

  constructor(session: Session) {
    this.mapHandler = new Map(session)
    this.session = session
  }

  public async create(characterId: number, socket?: ICustomSocket) {
    const sessions = await this.matchesService.findMatchSessions(this.session.match.id)
    const characterSession = sessions.find(session => session.character_id === characterId)

    const character = await this.characterService.findCharacterById(characterId)
    const user = await this.userService.findUserById(character.user_id)

    const spawnPoint = await this.mapHandler.getSpawnPoint()

    this.user = user
    this.character = character
    this.name = `character_${character.id}`
    this.spawn = spawnPoint
    this.group = null
    this.isReady = false
    this.isMaster = characterSession.is_master
    this.sessionId = socket ? socket.id : null
    this.socket = socket

    return this
  }
}
