import { IEvent } from "@/interfaces/match/match.interface"
import { ICustomSocket } from "../../match"
import { Session } from "../Session"
import { Bot } from "../../match/Bot"

export abstract class MatchEventBase {
  public socket: ICustomSocket
  public session: Session
  public bot: Bot

  constructor(socket: ICustomSocket, session: Session, bot: Bot) {
    this.socket = socket
    this.session = session
    this.bot = bot
  }

  public call(event: IEvent<any>) {}
}
