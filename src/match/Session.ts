import { IPlayer } from "@interfaces/match/match.interface"
import { IMatch } from "@interfaces/matches.interface"
import { IMap, IMapBlockResponse } from "@interfaces/match/map.interface"

export class Session {
  public players: Array<IPlayer> = []
  public match: IMatch
  public map: IMap = {
    blocks: []
  }

  public setMatch(match: IMatch) {
    this.match = match
  }

  public setBlocks(blocks: Array<IMapBlockResponse>) {
    this.map.blocks = blocks
  }

  public addPlayer(player: IPlayer) {
    const isExists = this.userExists(player.user.id)

    if (!isExists) {
      this.players.push(player)
    }
  }

  public getCharacterSession(characterId: number) {
    return this.players.find(player => player.character.id === characterId)
  }

  private userExists(userId: number) {
    return this.players.find(player => player.user.id === userId)
  }
}
