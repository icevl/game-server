import { CustomSocket } from "../match"

export class Processor {
  private socket: CustomSocket
  constructor(socket: CustomSocket) {
    this.socket = socket
  }

  public process(data: any) {
    console.log("ID", this.socket.id)
    console.log("PROCESS", data)
  }
}
