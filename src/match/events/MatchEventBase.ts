import { IEvent } from "@/interfaces/match/match.interface"
import { ICustomSocket } from "../../match"
import { Session } from "../Session"

export abstract class MatchEventBase {
  public socket: ICustomSocket
  public session: Session

  constructor(socket: ICustomSocket, session: Session) {
    this.socket = socket
    this.session = session
  }

  public call(event: IEvent<any>) {}
}
