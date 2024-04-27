import ByteBuffer from "./ByteBuffer.mjs";

export class SSLNegotiation {
  encode() {
    return new ByteBuffer(1).writeChar("N").asUint8Array();
  }
}

export class AuthenticationResponse {
  authOk = 0;
  encode() {
    return new ByteBuffer(9)
      .writeChar("R")
      .writeUint32(8)
      .writeUint32(this.authOk)
      .asUint8Array();
  }
}

export class BackendKeyData {
  pid = 1234;
  secretKey = 5678;
  encode() {
    return new ByteBuffer(13)
      .writeChar("K")
      .writeUint32(12)
      .writeUint32(this.pid)
      .writeUint32(this.secretKey)
      .asUint8Array();
  }
}

export class ReadyForQuery {
  transactionStatus = "I";
  encode() {
    return new ByteBuffer(6)
      .writeChar("Z")
      .writeUint32(5)
      .writeChar(this.transactionStatus)
      .asUint8Array();
  }
}

export class Field {
  constructor(
    name,
    tableObjectID,
    columnAttributeNumber,
    dataTypeOID,
    dataTypeSize,
    typeModifier,
    formatCode,
  ) {
    this.name = name;
    this.tableObjectID = tableObjectID;
    this.columnAttributeNumber = columnAttributeNumber;
    this.dataTypeOID = dataTypeOID;
    this.dataTypeSize = dataTypeSize;
    this.typeModifier = typeModifier;
    this.formatCode = formatCode;
  }
}

export class RowDescription {
  constructor(fields) {
    this.fields = fields;
  }
  encode() {
    const nameBuffers = this.fields.map((field) =>
      Buffer.from(field.name, "utf8"),
    );
    const length = nameBuffers.reduce(
      (acc, buffer) => acc + buffer.length + 19,
      6,
    );
    const byteBuffer = new ByteBuffer(length + 1)
      .writeChar("T")
      .writeUint32(length)
      .writeUint16(this.fields.length);

    for (const [index, field] of this.fields.entries()) {
      byteBuffer
        .writeUint8Array(nameBuffers[index])
        .writeUint8(0x0)
        .writeUint32(field.tableObjectID)
        .writeUint16(field.columnAttributeNumber)
        .writeUint32(field.dataTypeOID)
        .writeUint16(field.dataTypeSize)
        .writeUint32(field.typeModifier)
        .writeUint16(field.formatCode);
    }

    return byteBuffer.asUint8Array();
  }
}

export class DataRow {
  constructor(values) {
    this.values = values;
  }

  encode() {
    const valueBuffers = this.values.map((value) => Buffer.from(value, "utf8"));
    const length = valueBuffers.reduce(
      (acc, buffer) => acc + buffer.length + 4,
      6,
    );
    const byteBuffer = new ByteBuffer(length + 1)
      .writeChar("D")
      .writeUint32(length)
      .writeUint16(valueBuffers.length);
    for (const buffer of valueBuffers) {
      byteBuffer.writeUint32(buffer.length);
      byteBuffer.writeUint8Array(buffer);
    }
    return byteBuffer.asUint8Array();
  }
}

export class CommandComplete {
  constructor(commandTag) {
    this.commandTag = commandTag;
  }
  encode() {
    const commandTagBuffer = Buffer.from(this.commandTag, "utf8");
    const length = commandTagBuffer.length + 5;
    return new ByteBuffer(length + 1)
      .writeChar("C")
      .writeUint32(length)
      .writeUint8Array(commandTagBuffer)
      .writeUint8(0x0)
      .asUint8Array();
  }
}
