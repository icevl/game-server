import { EventType, IEvent, IEventConnect, IPlayer } from "@/interfaces/match/match.interface"
import UserService from "@services/users.service"
import CharacterService from "@services/characters.service"
import { MatchEventBase } from "./MatchEventBase"

export class MatchMap extends MatchEventBase {
  public async call(event: IEvent<any>) {
    switch (event.type) {
      case EventType.SpawnBlocksComplete:
        return this.spawnPlayers()

      default:
        return
    }
  }

  private spawnPlayers() {
    // this.socket.sendEvent({
    //   type: "spawn_player",
    //   data: { name: players[0], character: "swat", target: p, is_main: true, weapons: [] }
    // })
  }
}
