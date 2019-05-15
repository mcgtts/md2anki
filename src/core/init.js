const EventEmitter = require('events').EventEmitter;
const logger = require('../logger');
var fs = require("fs")
var path = require("path")
var axios = require("axios");

class Init extends EventEmitter {
    constructor({mdPath}) {
        super();
        this.mdPath = mdPath
    }

    run(cb) {
        let css = fs.readFileSync(path.resolve("./src/static/model/css.txt"),'utf8')
        let back = fs.readFileSync(path.resolve("./src/static/model/back.txt"),'utf8')
        let front = fs.readFileSync(path.resolve("./src/static/model/front.txt"),'utf8')
        fs.readFile(path.resolve("./src/static/model/css.txt"),'utf8',  (err, data) => {
            console.log(err)
            var option = {
                "action": "createModel",
                "version": 6,
                "params": {
                    "modelName": "md2anki",
                    "css": css,
                    "inOrderFields":["正面", "背面"],
                    "cardTemplates": [
                        {
                            "Front": front,
                            "Back": back
                        }
                    ]
                }
            }
        
            axios
                    .post('http://localhost:8765/', option)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                        self.__httpPost(option)
                    });
        })
        
    }
}

module.exports = Init;