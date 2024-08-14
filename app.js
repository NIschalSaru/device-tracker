import path from "path";
import express from "express";
import { Server } from "socket.io";
import http from "http";

const __dirname = path.resolve(); // get current directory path Eg:C:\Users\DELL\Desktop\NodeJS Project\device-tracker

const app = express();

//sertup of scoket.io
// ---------------------------------------
const server = http.createServer(app);
const io = new Server(server);
//--------------------------------------

//--------------------------------------------------
//setup express app with ejs template engine, ejs == blade file in laravel
app.set("view engine", "ejs"); //setup ejs
app.use(express.static(path.join(__dirname, "public"))); //public file setup, basically static file such as images, css , valilla js could be use
//--------------------------------------------------

//-----------------------------------------
//connection request from client to server is hadnled here
io.on("connection", (socket) => {
  console.log("connected");

  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data }); //broadcast location to all connected clients
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});
//-----------------------------------------

app.get("/", (req, res) => {
  res.render("index.ejs");
});

server.listen(3000, () => {
  console.log("App is running at port 3000");
});
