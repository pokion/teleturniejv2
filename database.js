import fs from 'fs';

export default class database{
    constructor(pathToDB){
        this.path = pathToDB;
        this.rawData;
        this.mapData;
        this.playerData = [];
        this.currentQuestionID = {categoryID: 0, questionID: 0}

        if(fs.existsSync(this.path)){
            fs.readFile(this.path, 'utf8', (err, data)=>{
                if(err) throw err
                this.rawData = JSON.parse(data)
                this.saveData(this.rawData)
            })
        }
        
        if(fs.existsSync(import.meta.dirname + '/players.json')){
            let fileContent = fs.readFileSync(import.meta.dirname + '/players.json', 'utf8')
            this.playerData = JSON.parse(fileContent)
        }
    }

    saveData(data){
        this.rawData = data;
        this.mapData = new Map();

        for(let entry of data){
            this.mapData.set(entry.id, {entry, questionsMap: new Map()});
                for(let question of entry.questions){
                    this.mapData.get(entry.id).questionsMap.set(question.id, question);
                }
        }

        fs.writeFile(this.path, JSON.stringify(data), function(err){
            console.log(err)
        })
    }

    getQuestion(categoryID, questionID){
        this.currentQuestionID.categoryID = categoryID;
        this.currentQuestionID.questionID = questionID;
        return this.mapData.get(categoryID).questionsMap.get(questionID);
    }

    getRawData(){
        return this.rawData;
    }

    savePlayers(playersData){
        console.log(playersData)
        fs.writeFile(import.meta.dirname + '/players.json', JSON.stringify(playersData), function(err){
            console.log(err)
        })
    }

    questionPlayed(){
        for(let category of this.rawData){
            if(category.id == this.currentQuestionID.categoryID){
                for(let question of category.questions){
                    if(question.id == this.currentQuestionID.questionID){
                        question.played = true;
                        break;
                    }
                }
            }
        }
        this.saveData(this.rawData);
        return this.rawData;
    }

    getPlayersData(){
        console.log('player data get')
        return this.playerData;
    }

}