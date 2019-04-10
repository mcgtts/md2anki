#!/usr/bin/env node

var fs = require("fs")
var path = require("path")

//正则表达式替换
var templateEngine = function (tpl, data) {
    var re = /<%=([^%<>]+)=%>/g;
    while (match = re.exec(tpl)) {
        //console.log( match );
        tpl = tpl.replace(match[0], data[match[1]]);
    }
    return tpl;
}

const ankiNote = {
    "deckName": "自定义Deck",
    "modelName": "基础-md2anki"
}

var args = process.argv.splice(2);
//console.log('所传递的参数是：', args);
if (args.length == 0) {
    console.error(`use 'node index.js path'`);
    process.exit(1);
}

// 异步读取目录
// https://blog.csdn.net/swl979623074/article/details/53021628
// var root = path.join(`${__dirname}/md`)
// console.log(root)
readDir(path.join(args[0]))

function readDir(path) {
    fs.readdir(path, function (err, menu) {

        if (!menu)
            return;
        menu.forEach(function (ele) {
            fs.stat(path + "/" + ele, async function (err, info) {
                if (info.isDirectory()) {
                    console.log("dir: " + ele)
                    readDir(path + "/" + ele);
                } else {
                    console.log("file: " + ele)
                    var md_file = syncReadFile(path + "/" + ele)
                    var responseData = convertMd(md_file)

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
                                tags: ['custom'],
                            }
                        }
                    }
                    httpPost(option)
                }
            })
        })
    })
}

async function httpPost(option) {
    var axios = require("axios");

    await axios.post('http://localhost:8765/', option)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
            httpPost(option)
        });
}

function syncReadFile(filePath) {
    var md_file = null;
    try {
        md_file = fs.readFileSync(filePath, "utf-8");
        return md_file
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

function convertMd(mdData) {
    require('./lib/showdown-prettify.js');
    var showdown = require('./lib/showdown.js');

    var markdownConverter = new showdown.Converter({
        extensions: ['prettify']
    });

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

    var template_file = path.resolve(__dirname, 'template2.html');
    var template = fs.readFileSync(template_file, "utf-8");

    //console.log(template);
    //const $ = cheerio.load(template,{decodeEntities: false})



    var html = markdownConverter.makeHtml(mdData);

    //$('#markdown-container').html(html);
    //console.log($.html());



    var data = {
        markdown_content: html
    };

    //writeToStdOut($.html());
    // console.log(templateEngine(template,data))
    // writeToStdOut(templateEngine(template,data));

    var htmlData = templateEngine(template, data)
    var htmlBodyData = htmlData.match(/<body.*?>([\s\S]*?)<\/body>/)[0]
    var title = mdData.match(/^---\ntitle: ([\s\S]*)\n-{3}/)[1]

    return {
        "title": title,
        "htmlBody": htmlBodyData
    }
}