export default class ByteBuffer {
  #arrayBuffer;
  #dataView;
  #offset = 0;

  constructor(byteLength) {
    this.#arrayBuffer = new ArrayBuffer(byteLength);
    this.#dataView = new DataView(this.#arrayBuffer);
  }

  writeUint8(int) {
    this.#dataView.setUint8(this.#offset, int);
    this.#offset += 1;
    return this;
  }

  writeUint16(int) {
    this.#dataView.setUint16(this.#offset, int, false);
    this.#offset += 2;
    return this;
  }

  writeUint32(int) {
    this.#dataView.setUint32(this.#offset, int, false);
    this.#offset += 4;
    return this;
  }

  writeString(str) {
    const buffer = Buffer.from(str, "utf8");
    buffer.copy(new Uint8Array(this.#arrayBuffer), this.#offset);
    this.#offset += buffer.length;
    return this;
  }

  writeCString(str) {
    this.writeString(str);
    this.#dataView.setUint8(this.#offset, 0x0);
    this.#offset += 1;
    return this;
  }

  asUint8Array() {
    return new Uint8Array(this.#arrayBuffer);
  }
}
