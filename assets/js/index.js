$(function() {
        // 调用“获取用户信息”函数
        getUserInfo()
        var layer = layui.layer
            // 退出
        $('#logOut').on('click', function() {
            layer.confirm('您确定要退出吗?', { icon: 3, title: '提示' }, function(index) {
                localStorage.removeItem('token')
                location.href = 'login.html'
                layer.close(index);
            });
        })
    })
    // 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token' || '')
        // },
        success: function(res) {
            console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        // complete: function(res) {
        //     console.log('执行了complete回调')
        //     console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         localStorage.removeItem('item')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

function renderAvatar(user) {
    var name = user.nickname || user.username
    $('.welcome').html("欢迎&nbsp;&nbsp;" + name)
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.text-avater').hide() //隐藏文字头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
}