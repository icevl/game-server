import { CustomSocket } from "../match"
import { IMatch } from "@interfaces/matches.interface"

export class Processor {
  private socket: CustomSocket
  private match: IMatch

  constructor(socket: CustomSocket, match: IMatch) {
    this.socket = socket
    this.match = match
  }

  public process(data: any) {
    console.log("ID", this.socket.id)
    console.log("Match ID", this.match.id)
    console.log("PROCESS", data)
  }
}
