import { EventType, IEvent, IEventConnect, IPlayer } from "@/interfaces/match/match.interface"
import MatchesService from "@services/matches.service"
import { MatchEventBase } from "./MatchEventBase"

const ak47 = {
  name: "AK47",
  magazine: 60,
  accuracy: 60,
  reload_time: 1,
  rate: 600,
  damage: 100
}

export class MatchMap extends MatchEventBase {
  private matchesService = new MatchesService()

  public async call(event: IEvent<any>) {
    switch (event.type) {
      case EventType.SpawnBlocksComplete:
        return this.spawnPlayers()

      default:
        return
    }
  }

  private async spawnPlayers() {
    const sessions = await this.matchesService.findMatchSessions(this.session.match.id)

    sessions.forEach(session => {
      const characterSession = this.session.getCharacterSession(session.character_id)

      this.socket.sendEvent({
        type: EventType.SpawnPlayer,
        data: {
          name: `character_${session.character.id}`,
          character: session.character.model,
          target: characterSession.spawn,
          is_main: true,
          weapons: [ak47]
        }
      })
    })
  }
}
