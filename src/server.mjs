import { Buffer } from "node:buffer";
import { createServer } from "node:net";

const noSSLResponse = new Uint8Array(["N".charCodeAt(0)]);

const authOkResponse = Buffer.alloc(9);
authOkResponse.writeInt8("R".charCodeAt(0), 0);
authOkResponse.writeInt32BE(8, 1);
authOkResponse.writeInt32BE(0, 5);

const backendKeyDataResponse = Buffer.alloc(13);
backendKeyDataResponse.writeInt8("K".charCodeAt(0), 0);
backendKeyDataResponse.writeInt32BE(12, 1);
backendKeyDataResponse.writeInt32BE(1234, 5);
backendKeyDataResponse.writeInt32BE(5678, 9);

const readyForQueryResponse = Buffer.alloc(6);
readyForQueryResponse.writeInt8("Z".charCodeAt(0), 0);
readyForQueryResponse.writeInt32BE(5, 1);
readyForQueryResponse.writeInt8("I".charCodeAt(0), 5);

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
