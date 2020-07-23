class Result {
}

// 10000-10099: common code
Result['10000'], Result.succ = {
    code: 10000,
    desc: '成功'
}
Result['10001'], Result.fail = {
    code: 10001,
    desc: '失败'
}
Result['10002'], Result.exception = {
    code: 10002,
    desc: '异常'
}
// 10101-10199: init error
Result['10101'], Result.ws_init_error = {
    code: 10101,
    desc: 'websocket初始化失败，请检查console service是否开启'
}
Result['10102'], Result.vue_init_error = {
    code: 10102,
    desc: 'vue初始化失败'
}
Result['10103'], Result.view_init_error = {
    code: 10103,
    desc: 'view初始化失败'
}
Result['10104'], Result.no_login = {
    code: 10104,
    desc: '尚未登录'
}
Result['10105'], Result.already_login = {
    code: 10105,
    desc: '已经登录'
}


export default Result;