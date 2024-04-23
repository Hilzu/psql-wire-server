import { createServer } from "node:net";
import ByteBuffer from "./ByteBuffer.mjs";

const noSSLResponse = new Uint8Array(["N".charCodeAt(0)]);

const authOkResponse = new ByteBuffer(9)
  .writeUint8("R".charCodeAt(0))
  .writeUint32(8)
  .writeUint32(0)
  .asUint8Array();

const backendKeyDataResponse = new ByteBuffer(13)
  .writeUint8("K".charCodeAt(0))
  .writeUint32(12)
  .writeUint32(1234)
  .writeUint32(5678)
  .asUint8Array();

const readyForQueryResponse = new ByteBuffer(6)
  .writeUint8("Z".charCodeAt(0))
  .writeUint32(5)
  .writeUint8("I".charCodeAt(0))
  .asUint8Array();

const handleConnection = async (socket) => {
  const remoteAddress = {
    address: socket.remoteAddress,
    family: socket.remoteFamily,
    port: socket.remotePort,
  };
  console.log("Client connected", remoteAddress);

  for await (const data of socket) {
    console.log("Data", data);
    socket.write(noSSLResponse);
    socket.write(authOkResponse);
    socket.write(backendKeyDataResponse);
    socket.write(readyForQueryResponse);
  }
};

const connectionListener = (socket) => {
  handleConnection(socket).catch((error) => {
    console.error("Error handling connection", error);
  });
};

export const server = createServer(connectionListener);
