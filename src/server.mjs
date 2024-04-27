import { createServer } from "node:net";
import { decodeClientMessage } from "./PgClientMessage.mjs";
import {
  AuthenticationResponse,
  BackendKeyData,
  CommandComplete,
  DataRow,
  Field,
  ReadyForQuery,
  RowDescription,
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
  } else if (msg.type === "query") {
    const fields = [
      new Field("pkey", 0, 0, 23, 4, -1, 0),
      new Field("text", 0, 0, 25, -1, -1, 0),
      new Field("desc", 0, 0, 25, -1, -1, 0),
    ];
    writeMessage(socket, new RowDescription(fields));
    writeMessage(socket, new DataRow(["111", "oneoneone", "A great row!"]));
    writeMessage(socket, new DataRow(["2", "two", "Not so great row..."]));
    writeMessage(socket, new CommandComplete(msg.query));
    writeMessage(socket, new ReadyForQuery());
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
