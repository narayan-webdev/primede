import { config } from "dotenv";
config()
import app from "./server.js";
import syntaxErrorhandler from "./src/middlewares/syntaxErrorhandler.js";
import notFoundHandler from "./src/middlewares/notFoundHandler.js";
import instance_starter from "./src/utils/instance_starter.js";
import initializSocket from "./src/utils/socket.js";
import { createServer } from "http";
const server = createServer(app);
instance_starter()
// initializSocket(server)
app.use(syntaxErrorhandler);


// adding routes
import "./src/utils/routes.js";
app.use(notFoundHandler);
// Start the server
const PORT = process.env.PORT || 4455;
server.listen(PORT)