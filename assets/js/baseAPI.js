$.ajaxPrefilter(function(options) {
    // console.log(options.url)
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        //统一为有权限的接口设定请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token' || '')
        }
    }
    // 统一挂载complete回调函数
    options.complete = function(res) {
        console.log('执行了complete回调')
        console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('item')
            location.href = '/login.html'
        }
    }
})