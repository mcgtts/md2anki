const shelljs = require('shelljs');
const EventEmitter = require('events').EventEmitter;
const logger = require('../logger');
const async = require('async');
var fs = require("fs")
var path = require("path")

const ankiNote = {
    "deckName": "职业::JS面试题",
    "modelName": "基础-md2anki"
}

class Import extends EventEmitter {
    constructor({mdPath}) {
        super();
        this.mdPath = mdPath
    }

    //正则表达式替换
    __templateEngine(tpl, data) {
        var re = /<%=([^%<>]+)=%>/g;
        let match = re.exec(tpl)
        //console.log( match );
        tpl = tpl.replace(match[0], data[match[1]]);

        return tpl;
    }

    __readDir(path) {
        let self = this
        fs.readdir(path, function (err, menu) {
            console.log(err)
            if (!menu) 
                return;
            
            menu
                .forEach(function (ele) {
                    fs
                        .stat(path + "/" + ele, async function (err, info) {
                            if (info.isDirectory()) {
                                console.log("dir: " + ele)
                                readDir(path + "/" + ele);
                            } else {
                                console.log("file: " + ele)
                                var md_file = self.__syncReadFile(path + "/" + ele)
                                var responseData = self.__convertMd(md_file)

                                var option = {
                                    action: 'addNote',
                                    version: 6,
                                    params: {
                                        note: {
                                            "deckName": ankiNote.deckName,
                                            "modelName": ankiNote.modelName,
                                            fields: {
                                                '正面': responseData.title,
                                                '背面': responseData.htmlBody
                                            },
                                            options: {
                                                allowDuplicate: false
                                            },
                                            tags: ['custom']
                                        }
                                    }
                                }

                                console.log(option)
                                self.__httpPost(option)
                            }
                        })
                })
        })
    }

    async __httpPost(option) {
        var axios = require("axios");

        let self = this
        await axios
            .post('http://localhost:8765/', option)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
                self.__httpPost(option)
            });
    }

    __syncReadFile(filePath) {
        var md_file = null;
        try {
            md_file = fs.readFileSync(filePath, "utf-8");
            return md_file
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    __convertMd(mdData) {
        require('../../lib/showdown-prettify.js');
        var showdown = require('../../lib/showdown.js');

        var markdownConverter = new showdown.Converter({extensions: ['prettify']});

        markdownConverter.setOption('tables', true);
        markdownConverter.setOption('simplifiedAutoLink', true);
        markdownConverter.setOption('strikethrough', true);
        markdownConverter.setOption('tablesHeaderId', true);
        markdownConverter.setOption('tasklists', true);
        markdownConverter.setOption('smoothLivePreview', true);
        markdownConverter.setOption('smartIndentationFix', true);
        markdownConverter.setOption('disableForced4SpacesIndentedSublists', true);
        markdownConverter.setOption('simpleLineBreaks', true);
        markdownConverter.setOption('openLinksInNewWindow', true);

        markdownConverter.setOption('emoji', true);
        markdownConverter.setOption('underline', true);

        markdownConverter.setOption('splitAdjacentBlockquotes', true);
        markdownConverter.setOption('customizedHeaderId', true);

        markdownConverter.setOption('parseImgDimensions', true);
        markdownConverter.setOption('headerLevelStart', 1);

        markdownConverter.setOption('metadata', true);
        markdownConverter.setOption('completeHTMLDocument', false);

        var path = require('path');

        var template_file = path.resolve(__dirname, '../../template2.html');
        var template = fs.readFileSync(template_file, "utf-8");

        // console.log(template); const $ = cheerio.load(template,{decodeEntities:
        // false})

        var html = markdownConverter.makeHtml(mdData);

        //$('#markdown-container').html(html); console.log($.html());

        var data = {
            markdown_content: html
        };

        // writeToStdOut($.html()); console.log(templateEngine(template,data))
        // writeToStdOut(templateEngine(template,data));

        var htmlData = this.__templateEngine(template, data)
        var htmlBodyData = htmlData.match(/<body.*?>([\s\S]*?)<\/body>/)[0]
        var title = mdData.match(/^---\ntitle: ([\s\S]*)\n-{3}/)[1]

        return {"title": title, "htmlBody": htmlBodyData}
    }

    run(cb) {
        const tasks = [];

        // 异步读取目录 https://blog.csdn.net/swl979623074/article/details/53021628 var root =
        // path.join(`${__dirname}/md`) console.log(root)
        this.__readDir(this.mdPath)

        tasks.push(cb => {
            // 检查node
            if (!shelljs.which('node')) {
                cb('Not Found node')
            } else {
                cb(null)
            }
        })
        tasks.push(cb => {
            cb(null)
        })

        async.series(tasks, cb);
    }
}

module.exports = Import;