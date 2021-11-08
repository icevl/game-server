import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import MatchesService from "@services/matches.service"
import { Map } from "./Map"
import { Npc } from "./npc/Npc"
import { ICustomSocket } from "../match"
import { IPlayer } from "@interfaces/match/match.interface"
import { IMatch } from "@interfaces/matches.interface"
import { IMap } from "@interfaces/match/map.interface"

export class Session {
  private userService = new UserService()
  private characterService = new CharacterService()
  private matchesService = new MatchesService()
  private mapHandler = new Map(this)

  public players: Array<IPlayer> = []
  public npcs: Array<Npc> = []

  public match: IMatch
  public map: IMap = {
    blocks: [],
    stage: 1,
    stageStartedAt: null,
    startGroupId: null,
    type: "coop"
  }

  public setMatch(match: IMatch) {
    this.match = match
  }

  public setMapData(map: IMap) {
    this.map = map
  }

  public setPlayerGroup(characterId: number, group: string) {
    this.players.forEach(player => {
      if (player.character.id === characterId) player.group = group
    })
  }

  public setPlayerReady(characterId: number, isReady: boolean) {
    this.players.forEach(player => {
      if (player.character.id === characterId) player.isReady = isReady
    })
  }

  public setPlayerSpawn(characterId: number, spawn: string) {
    this.players.forEach(player => {
      if (player.character.id === characterId) player.spawn = spawn
    })
  }

  public async addCharacter(characterId: number, socket?: ICustomSocket | null) {
    const sessions = await this.matchesService.findMatchSessions(this.match.id)
    const characterSession = sessions.find(session => session.character_id === characterId)

    const character = await this.characterService.findCharacterById(characterId)
    const user = await this.userService.findUserById(character.user_id)

    const spawnPoint = await this.mapHandler.getSpawnPoint()

    const playerExistsSession: IPlayer | null = this.players.reduce(
      (acc, item) => (item.character.id === character.id ? item : acc),
      null
    )

    const player: IPlayer = {
      user,
      character,
      name: `character_${character.id}`,
      spawn: spawnPoint,
      group: null,
      isReady: false,
      isMaster: characterSession.is_master,
      sessionId: socket ? socket.id : null
    }

    if (!playerExistsSession) {
      this.players.push(player)
    }
  }

  public addNPC(npc: Npc) {
    this.npcs.push(npc)
  }

  public async getMasterCharacter(): Promise<string> {
    const sessions = await this.matchesService.findMatchSessions(this.match.id)
    const masterCharacter = sessions.find(session => session.is_master)
    return `character_${masterCharacter.id}`
  }

  public getSocketPlayer(socketId: string): IPlayer {
    return this.players.find(player => player.sessionId === socketId)
  }

  public getPlayerByName(name: string): IPlayer {
    return this.players.find(player => player.name === name)
  }

  public getNPCByName(name: string): Npc {
    return this.npcs.find(npc => npc.name === name)
  }

  public getCharacterPlayer(characterId: number) {
    return this.players.find(player => player.character.id === characterId)
  }
}
