import { EventType, IEvent, IEventConnect, IPlayer } from "@/interfaces/match/match.interface"
import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import { MatchEventBase } from "./MatchEventBase"
import { Map } from "../Map"

export class MatchAuth extends MatchEventBase {
  private map = new Map(this.session)
  private userService = new UserService()
  private characterService = new CharacterService()

  public async call(event: IEvent<IEventConnect>) {
    if (event.data.match === this.session.match.uuid) {
      const character = await this.characterService.findCharacterById(event.data.character_id)
      const user = await this.userService.findUserById(character.user_id)

      const spawnPoint = await this.getSpawnPoint()

      const playerExistsSession: IPlayer | null = this.session.players.reduce(
        (acc, item) => (item.character.id === character.id ? item : acc),
        null
      )

      const player: IPlayer = {
        user,
        character,
        name: `character_${character.id}`,
        spawn: spawnPoint,
        sessionId: this.socket.id
      }

      if (!playerExistsSession) {
        this.session.addPlayer(player)
      }

      this.socket.sendEvent({ type: EventType.SpawnBlocks, data: this.session.map.blocks })
    }
  }

  private async getSpawnPoint(): Promise<string> {
    if (this.session.map.type === "coop") {
      const points = await this.map.getGroupPoints(this.session.map.startGroupId)
      return this.map.getFreeSpawnPoint(points)
    }

    return ""
  }
}
