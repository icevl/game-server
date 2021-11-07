import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import { Map } from "./Map"
import { ICustomSocket } from "../match"
import { IPlayer } from "@interfaces/match/match.interface"
import { IMatch } from "@interfaces/matches.interface"
import { IMap } from "@interfaces/match/map.interface"

export class Session {
  private userService = new UserService()
  private characterService = new CharacterService()
  private mapHandler = new Map(this)

  public players: Array<IPlayer> = []
  public match: IMatch
  public map: IMap = {
    blocks: [],
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

  public setPlayerSpawn(characterId: number, spawn: string) {
    this.players.forEach(player => {
      if (player.character.id === characterId) player.spawn = spawn
    })
  }

  public async addCharacter(characterId: number, socket?: ICustomSocket | null) {
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
      sessionId: socket ? socket.id : null
    }

    if (!playerExistsSession) {
      this.players.push(player)
    }
  }

  public getSocketPlayer(socketId: string): IPlayer {
    return this.players.find(player => player.sessionId === socketId)
  }

  public getPlayerByName(name: string): IPlayer {
    return this.players.find(player => player.name === name)
  }

  public getCharacterPlayer(characterId: number) {
    return this.players.find(player => player.character.id === characterId)
  }
}
