$(function() {
    console.log("进入了文章列表页面")
        // data是查询的参数对象，也是请求参数对象，调用接口的时候用data来发起请求
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    let render = layui.render
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        // 根据传入日期来获取 年月日时分秒格式
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    initTable()
    initCate()
        // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log("获取文章列表数据的接口响应数据")
                console.log(res)

                // 请求成功之后，使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('body').html(htmlStr)
                renderPage(res.total) //当文章列表加载完成之后，调用渲染分页的方法
            }


        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取文章分类列表失败了')
                }
                //否则就是获取文章分类列表成功了
                //开始渲染文章分类列表的模板引擎
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选区域的提交
    $('#cate_search').on('submit', function(e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val() //获取表单中选中项的值
        let state = $('[name=state]').val()
        q.cate_id = cate_id //为查询参数对象q中对应的属性赋值
        q.state = state
        initTable() //根据最新的筛选条件，重新渲染表格数据
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        console.log("数据总条数")
        console.log(total)
        laypage.render({
            elem: 'renderPage',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            },

        })


    }

    $('tbody').on('click', '.btn-delete', function() {
        console.log("出发了点击事件")
            // 通过代理的形式 出发点击事件，根据id号来删除某行数据
        let id = $(this).attr('data-id')
        let len = $('.sbtn-delete').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败了")
                    }
                    return layer.msg("删除文章分类成功了")
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})