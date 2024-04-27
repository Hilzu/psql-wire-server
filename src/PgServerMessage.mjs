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
