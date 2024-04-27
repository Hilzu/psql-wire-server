import ByteBuffer from "./ByteBuffer.mjs";

export class SSLNegotiation {
  encode() {
    return new Uint8Array(["N".charCodeAt(0)]);
  }
}

export class AuthenticationResponse {
  authOk = 0;
  encode() {
    return new ByteBuffer(9)
      .writeUint8("R".charCodeAt(0))
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
      .writeUint8("K".charCodeAt(0))
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
      .writeUint8("Z".charCodeAt(0))
      .writeUint32(5)
      .writeUint8(this.transactionStatus.charCodeAt(0))
      .asUint8Array();
  }
}

export class RowDescription {
  encode() {
    return (
      new ByteBuffer(51)
        .writeUint8("T".charCodeAt(0))
        .writeUint32(50) // length
        .writeUint16(2) // field count
        // field 1
        .writeCString("id")
        .writeUint32(0) // Object ID
        .writeUint16(0) // Attribute number
        .writeUint32(23) // Data type OID
        .writeUint16(4) // Data type size
        .writeUint32(-1) // Type modifier
        .writeUint16(0) // Format code
        // field 2
        .writeCString("name")
        .writeUint32(0) // Object ID
        .writeUint16(0) // Attribute number
        .writeUint32(25) // Data type OID
        .writeUint16(-1) // Data type size
        .writeUint32(-1) // Type modifier
        .writeUint16(0) // Format code

        .asUint8Array()
    );
  }
}

export class DataRow {
  constructor(columns) {
    this.columns = columns;
  }

  encode() {
    return new ByteBuffer(19)
      .writeUint8("D".charCodeAt(0))
      .writeUint32(18) // length
      .writeUint16(2) // column count
      .writeUint32(1) // length of column 1
      .writeString(this.columns[0])
      .writeUint32(3)
      .writeString(this.columns[1])
      .asUint8Array();
  }
}

export class CommandComplete {
  command = "SELECT 1";
  encode() {
    return new ByteBuffer(14)
      .writeUint8("C".charCodeAt(0))
      .writeUint32(13)
      .writeCString(this.command)
      .asUint8Array();
  }
}
