import { MatchEventBase } from "./MatchEventBase"

export class Pong extends MatchEventBase {
  public async call() {
    const player = this.session.getSocketPlayer(this.socket.id)
    player.keepAlive()
  }
}
