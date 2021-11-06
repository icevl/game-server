import { EventType, IEvent, IEventConnect, IPlayer } from "@/interfaces/match/match.interface"
import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import { MatchEventBase } from "./MatchEventBase"

export class MatchAuth extends MatchEventBase {
  private userService = new UserService()
  private characterService = new CharacterService()

  public async call(event: IEvent<IEventConnect>) {
    if (event.data.match === this.session.match.uuid) {
      const user = await this.userService.findUserById(event.data.user_id)

      const character = await this.characterService.findUserCharacter(user.id)

      const player: IPlayer = {
        user,
        character,
        name: `player_${user.id}`
      }

      this.session.addPlayer(player)
      this.socket.sendEvent({ type: EventType.SpawnBlocks, data: this.session.map.blocks })
    }
  }
}
