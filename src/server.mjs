import { createServer } from "node:net";
import { decodeClientMessage } from "./PgClientMessage.mjs";
import {
  AuthenticationResponse,
  BackendKeyData,
  ReadyForQuery,
  SSLNegotiation,
} from "./PgServerMessage.mjs";

const writeMessage = (socket, message) => {
  console.log("Sending message:", message);
  socket.write(message.encode());
};

const handleMessage = (msg, socket) => {
  console.log("Received message:", msg);
  if (msg.type === "sslNegotiation") {
    writeMessage(socket, new SSLNegotiation());
  } else if (msg.type === "startup") {
    writeMessage(socket, new AuthenticationResponse());
    writeMessage(socket, new BackendKeyData());
    writeMessage(socket, new ReadyForQuery());
  } else if (msg.type === "quit") {
    socket.end();
  } else {
    throw new Error("Unknown message type");
  }
};

const handleConnection = async (socket) => {
  const remoteAddress = {
    address: socket.remoteAddress,
    family: socket.remoteFamily,
    port: socket.remotePort,
  };
  console.log("Client connected", remoteAddress);

  for await (const data of socket) {
    const msg = decodeClientMessage(data);
    handleMessage(msg, socket);
  }
};

const connectionListener = (socket) => {
  handleConnection(socket).catch((error) => {
    console.error("Error handling connection:", error);
  });
};

export const server = createServer(connectionListener);
