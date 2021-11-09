import MatchesService from "@services/matches.service"
import { Npc } from "./npc/Npc"
import { ICustomSocket } from "../match"
import { IMatch } from "@interfaces/matches.interface"
import { IMap } from "@interfaces/match/map.interface"
import { Player } from "./Player"

export class Session {
  private matchesService = new MatchesService()

  public players: Array<Player> = []
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
    const playerExistsSession: Player | null = this.players.reduce(
      (acc, player) => (player.character.id === characterId ? player : acc),
      null
    )

    if (!playerExistsSession) {
      const player = await new Player(this).create(characterId, socket)
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

  public getSocketPlayer(socketId: string): Player {
    return this.players.find(player => player.sessionId === socketId)
  }

  public getPlayerByName(name: string): Player {
    return this.players.find(player => player.name === name)
  }

  public getNPCByName(name: string): Npc {
    return this.npcs.find(npc => npc.name === name)
  }

  public getCharacterPlayer(characterId: number) {
    return this.players.find(player => player.character.id === characterId)
  }
}
