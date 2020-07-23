import logger from "../logger";

class VideoWebsocket {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.socket = null;
        this.callbacks = {
            connect: [],
            data: []
        }
        this.reconnectInterval = options.reconnectInterval !== undefined ? options.reconnectInterval : 3;
        this.shouldAttemptReconnect = !!this.reconnectInterval;
        this.reconnectTimes = 0;
        this.completed = false;
        this.established = false;
        this.progress = 0;
        this.reconnectTimeoutId = 0;
        this.processor = options.processor;
    }

    connect(processor) {
        this.processor = processor
    }

    destroy() {
        clearTimeout(this.reconnectTimeoutId);
        this.shouldAttemptReconnect = false;
        this.socket.close()
    }

    /*init() {
        this.config.reset_port_array_index();
        this.url = this.config.get_next_ws_url();
        this.shouldAttemptReconnect = true;
        this.progress = 0;
        this.established = false;
        return this;
    }*/

    start() {
        this.shouldAttemptReconnect = !!this.reconnectInterval;
        this.progress = 0;
        this.established = false;
        //this.socket = new WebSocket(this.url, this.options.protocols || null);
        this.socket = new WebSocket(this.url);
        this.socket.binaryType = "arraybuffer";
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onerror = this.onClose.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    resume(secondsHeadroom) {
    }

    /*heartbeat() {
        if (this.heartId) {
            clearInterval(this.heartId);
            this.heartId = null;
        }
        let socket = this.socket;
        //socket.send("{msg_code:\"heartbeat\"}");
        this.heartId = setInterval(function () {
            logger.debug('ping');
            socket.send("{msg_code:\"heartbeat\"}");
        }, 10000);
    }*/

    onOpen() {
        logger.info('video ws onOpen');
        this.progress = 1;
        this.established = true;
        this.reconnectTimes = 0;

        //this.config.init_callback(this.processor.build_rsp_succ(Result.succ));
    }

    onClose() {
        logger.info('video ws onClose');
        if (this.shouldAttemptReconnect) {
            clearTimeout(this.reconnectTimeoutId);
            if (this.reconnectTimes > 3) {
                logger.info('video ws reconnectTimes>3,give up');
                this.shouldAttemptReconnect = false;
            }
            this.reconnectTimes++;
            this.reconnectTimeoutId = setTimeout(function () {
                this.start()
            }.bind(this), this.reconnectInterval * 1e3)
        }
    }

    onError(event) {
        logger.warn("video ws onError:{}", event);
    }

    onMessage(ev) {
        //logger.debug(ev.data);
        this.processor.receive(ev.data)
    }

}

export default VideoWebsocket;