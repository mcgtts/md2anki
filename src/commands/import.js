const Logger = require('../logger');
const Import = require('../core/import')

module.exports = {
    usage: '[options]',
    description: '导入Markdown 到anki里',
    options: {
        '-d, --directory <directory>': '配置md 的绝对路径'
    },
    action: (options) => {
        new Import({
            mdPath: options.directory || null
        }).run((err) => {
            if (err) {
                Logger.error(`执行 —— 失败！${err}`);
            } else {
                Logger.success('执行 —— 成功！');
            }
        });
    }
};