const Logger = require('../logger');
const Import = require('../core/import')

module.exports = {
    usage: '[options]',
    description: '导入Markdown 到anki里',
    options: {
        '-d, --directory <crashConfig>': '配置md 的绝对路径'
    },
    action: (options) => {
        new Import({
            mdPath: options.directory || null
        }).run((err) => {
            if (err) {
                Logger.error(`检查运行环境 —— 失败！${err}`);
            } else {
                Logger.success('检查运行环境 —— 成功！');
            }
        });
    }
};