import crypto from 'crypto';
import fs from 'fs';

export default function socketConnection(io, database){
    let players = database.getPlayersData();
    let currentQuestion;
    let playerQueueCount = 0;


    io.on('connection', (socket)=>{

        socket.on('changeQuestion', (args)=>{
            currentQuestion = database.getQuestion(args.categoryID, args.questionID);
            socket.emit('currentQuestion', currentQuestion)
            socket.broadcast.emit('currentQuestion', currentQuestion);
        })

        socket.on('currentQuestion', ()=>{
            socket.emit('currentQuestion', currentQuestion)
        })

        socket.on('showSection', (section)=>{
            socket.broadcast.emit('showSection', section);
        })

        socket.on('playMusic', (musicName)=>{
            console.log(musicName)
            socket.broadcast.emit('playMusic', musicName)
        })

        socket.on('stopMusic', ()=>{
            socket.broadcast.emit('stopMusic')
        })

        socket.on('selectPlayer', (id)=>{
            for(let player of players){
                if(player.id == id){
                    socket.broadcast.emit('currentPlayer', player);
                    socket.emit('currentPlayer', player);
                }
            }
        })

        socket.on('createPlayer', (args)=>{
            console.log('args')
            let imageSplit = args.image.split(',');
            let extension = imageSplit[0].split('/')[1].split(';')[0];
            let imageName = crypto.randomBytes(8).toString('hex') + '.' + extension
            fs.writeFile(import.meta.dirname + '/public/' + imageName, imageSplit[1], 'base64', function(err){
                console.log('socket create Player: ' + err);
            })
            players.push({name: args.name, image: imageName, points: 0, id: crypto.randomBytes(5).toString('hex')});
            database.savePlayers(players);
            socket.broadcast.emit('allPlayers', players);
            socket.emit('allPlayers', players);
        })

        socket.on('getAllPlayers', ()=>{
            socket.emit('allPlayers', players);
        })

        socket.on('nextPlayer', ()=>{
            socket.broadcast.emit('currentPlayer', players[playerQueueCount]);
            socket.emit('currentPlayer', players[playerQueueCount]);
            playerQueueCount++;
            if(playerQueueCount == players.length) playerQueueCount = 0;
        })

        socket.on('addPlayerPoints', (playerId, points)=>{
            for(let player of players){
                if(playerId == player.id){
                    player.points += points;
                    socket.emit('currentPlayer', player);
                    break;
                }
            }
            socket.broadcast.emit('allPlayers', players);
            socket.emit('allPlayers', players);
            database.savePlayers(players);
            let raw = database.questionPlayed()
            socket.broadcast.emit('updateRawData', raw)
            socket.emit('updateRawData', raw)
        })
    });

    
}

