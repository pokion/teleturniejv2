import express from 'express';

const app = express();
app.use(express.static('public'));


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

app.listen(8080, ()=>{
    console.log('Server is running.')
})