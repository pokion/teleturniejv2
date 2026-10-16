import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketConnections from './socketConnections.js';
import routing from './routing.js';
import Database from './database.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const DB = new Database(import.meta.dirname + '/questions.json');
app.use(express.static('public'));
app.use(bodyParser.json({limit: '10mb'}));

routing(app, DB)

socketConnections(io, DB);


httpServer.listen(8080);