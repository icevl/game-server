import { Session } from "./Session"
import { EventType } from "@/interfaces/match/match.interface"

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

  private init() {
    if (this.session.map.type === "coop") {
      this.statsInterval = setInterval(() => this.syncStats(), 10000)
    }
  }
}
