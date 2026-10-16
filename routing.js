import fs from 'fs';

export default (app, database)=>{
    app.get('/panel', (req,res)=>{
        res.sendFile('panel.html', {root: import.meta.dirname})
    })

    app.get('/board', (req,res)=>{
        res.sendFile('leaderboard.html', {root: import.meta.dirname})
    })

    app.get('/game', (req,res)=>{
        res.sendFile('game.html', {root: import.meta.dirname})
    })

    app.get('/adminPhone', (req,res)=>{
        res.sendFile('adminPhone.html', {root: import.meta.dirname})
    })

    app.post('/files', (req,res)=>{
        fs.writeFile(import.meta.dirname + '/public/' + req.body.name, req.body.value, 'base64', function(err){
            console.log(err);
        })
        res.status(200).end()
    })

    app.post('/data', (req,res)=>{
        database.saveData(req.body);
        res.status(200).end();
    })

    app.get('/data', (req,res)=>{
        res.json(database.getRawData());
    })

    app.get('/question', (req,res)=>{
        res.sendFile('question.html', {root: import.meta.dirname})
    })

    app.get('/createPlayer', (req,res)=>{
        res.sendFile('createPlayer.html', {root: import.meta.dirname});
    })

    app.post('/createPlayer', (req,res)=>{
        console.log(req.body);
        res.status(200).end();
    })
}