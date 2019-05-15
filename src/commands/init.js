const Logger = require('../logger');
const Init = require('../core/init')

module.exports = {
    usage: '[options]',
    description: '初始化anki， 创建mode name',
    options: {
        '-m, --modeName <mode Name>': 'mode 名称'
    },
    action: (options) => {
        new Init({
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