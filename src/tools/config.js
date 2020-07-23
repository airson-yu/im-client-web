import logger from "../tools/logger";

class Config {

    constructor() {
        //this.callbackArraySize = 1000;
        this.ws_url = 'ws://localhost:port/console';
        //this.ws_url = 'ws://192.168.1.119:port/console';
        this.portArray = [9080, 3001, 3002, 3003, 3004, 3005];
        this.cur_port = 9080;
        this.portArraySize = this.portArray.length;
        this.portArrayIndex = 0;
        this.dev_mode = true;
        //this.write_log_interval = 2000;    // 日志写入文件间隔时间
        //this.check_file_interval = 300000; // 检查Log间隔时间 600000 = 10Min
        //this.log_file_max_len = 5000000;   // 单个日志文件最大容量
        this.log_default_level = 20;       // 默认日志级别 level_list: {all: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60, notice: 90, none: 100},
        this.gps_timeout = 30000;          // 获取GPS超时时间 30s
        this.check_ver_interval = 1200000; // 1200000:每20分钟检查一下升级 XXX FIXME
        this.heart_beat_interval = 15000;  // 15s一次心跳
        this.heart_beat_max_err = 20;      // 最多心跳异常次数
        this.init_callback = null;
        this.logon_callback = null;
        this.video_canvas_default_w = 640;//640*0.6=384,640*0.95=608 微调一点，不能小于窗口footer的最小宽度;
        this.video_canvas_default_h = 480;//480*0.6=288,640*0.95=456
        this.video_modal_default_w = 484;//480*0.6=288,640*0.95=456
    }

    get_next_ws_url = () => {
        let next_port = this.portArray[this.portArrayIndex];
        let url = this.ws_url.replace('port', next_port);
        this.portArrayIndex++;
        if (this.portArrayIndex > (this.portArraySize - 1)) {
            //this.portArrayIndex = 0;
            logger.warn('init all port fail');
            this.cur_port = 9080;
            return null;
        }
        logger.info('try ws url:{}', url);
        this.cur_port = next_port;
        return url;
    }

    get_cur_port = () => {
        return this.cur_port;
    }

    build_video_url = (playid) => {
        return 'ws://localhost:' + this.get_cur_port() + '/data/' + playid;
    }

    reset_port_array_index = () => {
        this.portArrayIndex = 0;
    }

}

export default new Config();