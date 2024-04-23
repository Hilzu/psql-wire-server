import { server } from "./server.mjs";
import { port } from "./config.mjs";

server.listen(port, () => {
  console.log("Server is listening", server.address());
});
