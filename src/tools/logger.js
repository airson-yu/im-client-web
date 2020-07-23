import moment from 'moment';

let logger = {
    //this.processor = processor;
    //this.config = processor.config;
    //this.dev_mode = this.config.dev_mode; // 是否为开发模式，非开发模式下不调用console输出
    dev_mode: true,
    level_list: {all: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60, notice: 90, none: 100},
    level_name_list: {all: 'all', debug: 'debug', info: 'info', warn: 'warn', error: 'error', fatal: 'fatal', notice: 'notice', none: 'none'},
    //this.level = this.config.log_default_level;
    level: 20,
    //this.write_log_interval = this.config.write_log_interval;

    setLevel: function (lvl) {
        this.level = lvl;
        return logger;
    },

    isDebugEnable: function () {
        return logger.level <= logger.level_list.debug;
    },

    private_log: function (level_num, level_name, msg, args) {

        if (logger.level <= level_num) { // 符合输出级别

            // ie11 不支持 toLocaleString 'zh-CN
            //let date = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
            let date = moment().format('YYYY-MM-DD HH:mm:ss');
            //date = date.substring(0, date.length - 5);
            let pre_msg = date + ' ' + level_name + ':';
            let args_for_console = []; // 用于浏览器console打印的参数，主要是为了打印对象（console打印对象更直观）
            this.dev_mode && args_for_console.push(pre_msg);

            let args_len = args.length;
            if (args_len > 1) { // 支持{}模板语法
                // FIXME 支持{}模板语法
                let msg_len = 1;
                let ary;
                if (typeof msg === 'string') {
                    ary = msg.split('{}');
                    msg_len = ary.length;
                }
                let msg_build = '';
                if (msg_len == 1) { // 没有使用{}
                    for (let i = 0; i < args.length; i++) {
                        let param = args[i];
                        if (typeof param === 'object') {// 打印对象
                            param = JSON.stringify(param);
                        }
                        if (param === null || param === undefined) param = '';
                        msg_build += param;
                    }
                    if (this.dev_mode) {
                        args_for_console = args;// 没有使用{}，直接使用传入参数
                    }
                } else {
                    if (msg_len != args.length) {
                        throw 'arguments not match';
                    }
                    msg_build = msg;
                    for (let i = 1; i < msg_len; i++) { //替换{}
                        let param = args[i];
                        let paramStr;
                        if (typeof param === 'object') {// 打印对象
                            paramStr = JSON.stringify(param);
                        } else {
                            paramStr = param;
                        }
                        if (paramStr === null || paramStr === undefined) paramStr = '';
                        msg_build = msg_build.replace('{}', paramStr);
                        if (this.dev_mode) {
                            args_for_console.push(ary[i - 1]);
                            args_for_console.push(param);
                        }
                    }
                    if (this.dev_mode) {
                        args_for_console.push(ary[msg_len - 1]);
                    }
                }
                msg = msg_build;
            } else {
                if (typeof msg === 'object') {// 打印对象
                    msg = JSON.stringify(msg);
                }
                if (this.dev_mode) {
                    args[0] = pre_msg + ' ' + msg;
                    args_for_console = args;// 没有使用{}，直接使用传入参数
                }
            }

            // XXX 防止内容过长
            let msg_len = msg.length;
            if (msg_len > 500) {
                msg = msg.substring(0, 350) + '...' + msg.substring(msg_len - 101, msg_len - 1);
            }

            // TODO TODO
            msg = date + ' ' + level_name + ': ' + msg + '\r\n';

            // XXX console 打印对象更直观
            //let all_msg = level_name + " : " + msg;
            if (level_num <= this.level_list.debug) {
                this.dev_mode && console.log.apply(console, args_for_console);
                //logger.dom_id && (this.log_dom(msg, level_name));
            } else if (level_num <= this.level_list.info) {
                this.dev_mode && console.info.apply(console, args_for_console);
                //logger.dom_id && (this.log_dom(msg, level_name));
            } else if (level_num <= this.level_list.warn) {
                this.dev_mode && console.warn.apply(console, args_for_console);
                //logger.dom_id && (this.log_dom(msg, level_name));
            } else if (level_num <= this.level_list.fatal) {
                this.dev_mode && console.error.apply(console, args_for_console);
                //logger.dom_id && (this.log_dom(msg, level_name));
            } else if (level_num <= this.level_list.notice) {
                this.dev_mode && console.info.apply(console, args_for_console);
                ui.alert(msg);
            }

            this.output(level_num, level_name, msg);
        }
        return logger;
    }
    ,

    debug: function (msg) {
        return this.private_log(this.level_list.debug, this.level_name_list.debug, msg, arguments);
    },

    info: function (msg) {
        return this.private_log(this.level_list.info, this.level_name_list.info, msg, arguments);
    },

    warn: function (msg) {
        return this.private_log(this.level_list.warn, this.level_name_list.warn, msg, arguments);
    },

    error: function (msg) {
        return this.private_log(this.level_list.error, this.level_name_list.error, msg, arguments);
    },

    fatal: function (msg) {
        return this.private_log(this.level_list.fatal, this.level_name_list.fatal, msg, arguments);
    },

    notice: function (msg) {
        /*console.info('notice : ' + msg);
        ui.alert(msg);
        logger.dom_id && (this.log_dom(msg, '提示'));
        this.log_file(80, 'notice', msg);*/
        return this.private_log(this.level_list.notice, this.level_name_list.notice, msg, arguments);
    },

    output: function (level_num, level_name, msg) {
        let node = document.getElementById('sdk_output');
        if (!node) {
            return false;
        }
        let pre = node.innerHTML;
        if (pre.length > 15000) {
            pre = '';
        }
        let color = 'black';
        if (level_name == 'error') {
            color = 'red';
        } else if (level_name == 'warn') {
            color = 'orange';
        } else if (level_name == 'info') {
            color = 'blue';
        }
        let content = pre + '<br/><span style="color: ' + color + ';">' + msg + '</span>';
        node.innerHTML = content;
        node.scrollTop = node.scrollHeight;
        return true;
    }

}

export default logger;