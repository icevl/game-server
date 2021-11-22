import { EventType, IEvent, IEventHoldSpawnPoint } from "@/interfaces/match/match.interface"
import MatchesService from "@services/matches.service"
import { MatchEventBase } from "./MatchEventBase"

const ak47 = {
  name: "AK47",
  magazine: 60,
  accuracy: 60, //60,
  reload_time: 2,
  rate: 600,
  damage: 100
}

const electro = {
  name: "Electro",
  magazine: 160,
  accuracy: 100, //60,
  reload_time: 1,
  rate: 300,
  damage: 300
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
    const me = this.session.getSocketPlayer(this.socket.id)
    const sessions = await this.matchesService.findMatchSessions(this.session.match.id)

    sessions.forEach(session => {
      const characterPlayer = this.session.getCharacterPlayer(session.character_id)

      if (characterPlayer) {
        const playerPayloadEvent = {
          type: EventType.SpawnPlayer,
          data: {
            name: `character_${session.character.id}`,
            nick: characterPlayer.nick,
            character: session.character.model,
            position: characterPlayer.position,
            max_health: characterPlayer.maxHealth,
            current_health: characterPlayer.currentHealth,
            target: characterPlayer.spawn,
            is_main: me.character.id === session.character_id,
            is_bot: session.character.is_bot,
            weapons: [ak47, electro],
            heal_count: characterPlayer.healCount
          }
        }

        this.socket.sendEvent(playerPayloadEvent)

        // Send event to other players
        if (me.character.id === session.character_id) {
          playerPayloadEvent.data.is_main = false
          this.session.sendToOthers(me.character.id, playerPayloadEvent)
        }
      }
    })

    this.session.setPlayerReady(me.character.id, true)
    this.socket.sendEvent({ type: EventType.SetSpawnGroup, data: { character: me.name, name: me.group } })
  }

  private holdSpawnPoint(event: IEvent<IEventHoldSpawnPoint>) {
    const player = this.session.getPlayerByName(event.data.character)
    player.position = event.data.position
    this.session.setPlayerSpawn(player.character.id, event.data.point)
  }
}
