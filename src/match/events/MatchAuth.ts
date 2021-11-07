import { EventType, IEvent, IEventConnect, IPlayer } from "@/interfaces/match/match.interface"
import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import { MatchEventBase } from "./MatchEventBase"
import { Map } from "../Map"

export class MatchAuth extends MatchEventBase {
  private map = new Map()
  private userService = new UserService()
  private characterService = new CharacterService()

  public async call(event: IEvent<IEventConnect>) {
    if (event.data.match === this.session.match.uuid) {
      const user = await this.userService.findUserById(event.data.user_id)

      const character = await this.characterService.findUserCharacter(user.id)
      const spawnPoint = await this.getSpawnPoint()

      const player: IPlayer = {
        user,
        character,
        name: `character_${character.id}`,
        spawn: spawnPoint,
        sessionId: this.socket.id
      }

      this.session.addPlayer(player)
      this.socket.sendEvent({ type: EventType.SpawnBlocks, data: this.session.map.blocks })
    }
  }

  private async getSpawnPoint(): Promise<string> {
    let groupId = 1

    const points = await this.map.getGroupPoints(groupId)
    return points[1]
    return ""
  }
}
