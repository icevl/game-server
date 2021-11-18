import dayjs from "dayjs"
import { ICharacter, IVector3 } from "@interfaces/characters.interface"
import { IUser } from "@interfaces/users.interface"
import { EventType } from "@interfaces/match/match.interface"
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

  private pingInterval: NodeJS.Timer

  private session: Session

  public character: ICharacter
  public user: IUser
  public name: string
  public nick: string
  public spawn: string
  public group: string | null
  public isReady: boolean
  public isMaster: boolean
  public sessionId: string
  public lastActiveAt: Date
  public position: IVector3

  public maxHealth: number
  public currentHealth: number

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
    this.nick = character.name;
    this.spawn = spawnPoint
    this.group = null
    this.isReady = false
    this.isMaster = characterSession.is_master
    this.sessionId = socket ? socket.id : null
    this.socket = socket
    this.lastActiveAt = dayjs().toDate()
    this.maxHealth = 1000
    this.currentHealth = 1000

    this.position = {
      x: 0,
      y: 0,
      z: 0
    }

    if (!this.character.is_bot) this.startPing()

    return this
  }

  public get lastActiveAgo(): number {
    if (this.character.is_bot) return 0
    return dayjs().diff(dayjs(this.lastActiveAt), "seconds")
  }

  public get isOnline() {
    return this.lastActiveAgo <= 7
  }

  public takeDamage(damage: number) {
    this.currentHealth -= damage

    if (this.currentHealth <= 0) {
      this.currentHealth = 0
    }
  }

  public destroy() {
    clearInterval(this.pingInterval)
  }

  public keepAlive() {
    this.lastActiveAt = dayjs().toDate()
  }

  public reconnect(socket: ICustomSocket) {
    this.sessionId = socket.id
    this.socket = socket
    this.keepAlive()
    clearInterval(this.pingInterval)
    this.startPing()
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      this.socket.sendEvent({ type: EventType.Ping })
    }, 2000)
  }
}
