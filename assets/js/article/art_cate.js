$(function() {
    initArtCateList()
    let layer = layui.layer
    var form = layui.form
        // function initArtCateList() {
        //     $.ajax({
        //         url: "/my/article/cates",
        //         method: "GET",
        //         success: function(res) {
        //             console.log(res)
        //             var htmlStr = template('tpl-tbale', res)
        //             $('tbody').html(htmlStr)
        //         }
        //     })
        // }
    function initArtCateList() {
        $.ajax({

            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    $('body').on('submit', '#formId', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("新增文章失败了！")
                }
                initArtCateList()
                layer.msg("新增文章成功了！")
                layer.close(indexAdd)

            }
        })
    })
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            });
            var id = $(this).attr('data-id')
                // 发起请求 获取对应的分类信息
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    console.log("hhhhhhhhhhhhh")
                    form.val('form-edit', res.data)

                }
            })
        })
        // 通过代理的方式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("修改分类列表失败了")
                    }
                    layer.msg("修改分类数据成功！")
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
        // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // console.log("您确定要删除这一行信息吗？")
        var id = $(this).attr('data-id')
        layer.confirm('您确定删除这一行信息吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log("我是删除分类的接口")
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败了")
                    }
                    layer.msg("删除文章分类成功了！")
                    initArtCateList()
                    layer.close(index);
                }
            })

        });
    })
})