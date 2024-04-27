export const decodeClientMessage = (buffer) => {
  switch (true) {
    case PGClientSSLNegotiation.isOfType(buffer):
      return new PGClientSSLNegotiation();

    case PGClientStartupMessage.isOfType(buffer):
      return PGClientStartupMessage.decode(buffer);

    case PGClientQuitMessage.isOfType(buffer):
      return new PGClientQuitMessage();

    case PGClientQueryMessage.isOfType(buffer):
      return PGClientQueryMessage.decode(buffer);

    default:
      console.error("Unknown client message:", buffer);
      throw new Error("Unknown client message");
  }
};

const getMessageLength = (buffer, byteOffset = 0) => {
  const length = new DataView(buffer.buffer).getUint32(byteOffset);
  const bufferLength = buffer.byteLength - byteOffset;
  if (length !== bufferLength) throw new Error("Invalid message length");
  return length;
};

// <Buffer 00 00 00 08 04 d2 16 2f>
export class PGClientSSLNegotiation {
  type = "sslNegotiation";

  static isOfType(buffer) {
    return (
      buffer[4] === 0x04 &&
      buffer[5] === 0xd2 &&
      buffer[6] === 0x16 &&
      buffer[7] === 0x2f
    );
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
    const length = getMessageLength(buffer);
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

// <Buffer 58 00 00 00 04>
export class PGClientQuitMessage {
  type = "quit";
  static isOfType(buffer) {
    return String.fromCharCode(buffer[0]) === "X";
  }
}

export class PGClientQueryMessage {
  type = "query";
  query = "";

  static isOfType(buffer) {
    return String.fromCharCode(buffer[0]) === "Q";
  }

  static decode(buffer) {
    const length = getMessageLength(buffer, 1);
    const message = new PGClientQueryMessage();
    message.query = buffer.toString("utf-8", 5, length - 1);
    return message;
  }
}
