import { EventType, IEvent, IEventHoldSpawnPoint } from "@/interfaces/match/match.interface"
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

      case EventType.HoldSpawnPoint:
        return this.holdSpawnPoint(event as IEvent<IEventHoldSpawnPoint>)

      default:
        return
    }
  }

  private async spawnPlayers() {
    const player = this.session.getSocketPlayer(this.socket.id)
    const sessions = await this.matchesService.findMatchSessions(this.session.match.id)

    sessions.forEach(session => {
      const characterPlayer = this.session.getCharacterPlayer(session.character_id)

      if (characterPlayer) {
        this.socket.sendEvent({
          type: EventType.SpawnPlayer,
          data: {
            name: `character_${session.character.id}`,
            character: session.character.model,
            target: characterPlayer.spawn,
            is_main: player.character.id === session.character_id,
            weapons: [ak47]
          }
        })
      }
    })

    this.socket.sendEvent({ type: EventType.SetSpawnGroup, data: { character: player.name, name: player.group } })
  }

  private holdSpawnPoint(event: IEvent<IEventHoldSpawnPoint>) {
    const player = this.session.getPlayerByName(event.data.character)
    this.session.setPlayerSpawn(player.character.id, event.data.point)
  }
}
