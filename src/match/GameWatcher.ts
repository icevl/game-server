import { Session } from "./Session"
import { EventType } from "@interfaces/match/match.interface"
import { State } from "./npc/Npc"

export class GameWatcher {
  private session: Session

  private statsInterval: NodeJS.Timer

  constructor(session: Session) {
    this.session = session
    this.init()
  }

  public syncStats() {
    if (!this.session.map.stageStartedAt) return

    this.session.players.forEach(player => {
      this.session.broadcast({
        type: EventType.CharacterMatchScore,
        data: { character: player.name, score: player.score }
      })
    })
  }

  private bossHandler() {
    const boss = this.session.npcs.filter(npc => npc.config.is_boss && npc.currentHealth > 0).pop()
    if (!boss) return

    const isScream = Math.round(Math.random() * (10 - 1) + 1)

    if (isScream === 5) {
      boss.scream()
    }

    if (boss.state === State.Idle) {
      boss.startMoving(true)
    }
  }

  private init() {
    if (this.session.map.type === "coop") {
      this.statsInterval = setInterval(() => this.syncStats(), 10000)
      this.statsInterval = setInterval(() => this.bossHandler(), 2000)
    }
  }
}
