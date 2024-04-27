export const decodeClientMessage = (buffer) => {
  switch (true) {
    case PGClientSSLRequest.isOfType(buffer):
      return PGClientSSLRequest.decode(buffer);
    case PGClientStartupMessage.isOfType(buffer):
      return PGClientStartupMessage.decode(buffer);
    case PGClientQuitMessage.isOfType(buffer):
      return new PGClientQuitMessage();
    default:
      console.error("Unknown client message:", buffer);
      throw new Error("Unknown client message");
  }
};

export class PGClientSSLRequest {
  type = "sslRequest";

  static isOfType(buffer) {
    return (
      buffer[4] === 0x04 &&
      buffer[5] === 0xd2 &&
      buffer[6] === 0x16 &&
      buffer[7] === 0x2f
    );
  }

  static decode(buffer) {
    return new PGClientSSLRequest();
  }
}

export class PGClientStartupMessage {
  type = "startup";
  parameters = new Map();

  static isOfType(buffer) {
    return (
      buffer[4] === 0x00 &&
      buffer[5] === 0x03 &&
      buffer[6] === 0x00 &&
      buffer[7] === 0x00
    );
  }

  static decode(buffer) {
    const length = new DataView(buffer.buffer).getUint32(0);
    if (length !== buffer.byteLength) throw new Error("Invalid message length");
    let offset = 8;
    const message = new PGClientStartupMessage();
    const params = message.parameters;
    while (offset < length - 1) {
      const keyNullIndex = buffer.indexOf(0x0, offset);
      const key = buffer.toString("utf-8", offset, keyNullIndex);
      offset = keyNullIndex + 1;
      const valueNullIndex = buffer.indexOf(0x0, offset);
      const value = buffer.toString("utf-8", offset, valueNullIndex);
      offset = valueNullIndex + 1;
      params.set(key, value);
    }
    return message;
  }
}

export class PGClientQuitMessage {
  type = "quit";
  static isOfType(buffer) {
    return String.fromCharCode(buffer[0]) === "X";
  }
}
