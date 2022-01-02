$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // data是查询的参数对象，也是请求参数对象，调用接口的时候用data来发起请求
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

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
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败了")
                }
                console.log("获取文章列表成功了")
                console.log(res)
                    // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
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
    $('#form-search').on('submit', function(e) {
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
            elem: 'pageBox',
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
        console.log("触发了点击事件")
            // 通过代理的形式 出发点击事件，根据id号来删除某行数据
        let id = $(this).attr('data-id')
        let len = $('.btn-delete').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败了")
                    }
                    layer.msg("删除文章分类成功了")
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable() //根据最新的筛选条件，重新渲染表格数据
                }
            })
            layer.close(index);
        });
    })


    // 编辑文章
    $('tbody').on("click", '.btn-edit', function() {
        console.log("您即将编辑文章") //点击了编辑的按钮之后，弹出一个编辑文章的弹出层
            // location.href = '/article/art_edit.html'
            // 需要将以前的数据填充过来
        let id = $(this).attr('data-id')
            //    发起请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("根据id获取文章详情失败了")
                }
                // layer.msg("根据id获取文章详情成功了")
                console.log(res)
                form.val('form-edit', res.data)
            }
        })

    })
})