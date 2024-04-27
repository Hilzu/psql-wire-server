export default class ByteBuffer {
  #arrayBuffer;
  #dataView;
  #offset = 0;

  constructor(byteLength) {
    this.#arrayBuffer = new ArrayBuffer(byteLength);
    this.#dataView = new DataView(this.#arrayBuffer);
  }

  writeChar(str) {
    return this.writeUint8(str.charCodeAt(0));
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

  writeBuffer(buffer) {
    buffer.copy(new Uint8Array(this.#arrayBuffer), this.#offset);
    this.#offset += buffer.length;
    return this;
  }

  asUint8Array() {
    return new Uint8Array(this.#arrayBuffer);
  }
}
