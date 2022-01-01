$(function() {
    let layer = layui.layer
    let form = layui.form
    let render = layui.render
    initCate()
    initEditor() // 初始化富文本编辑器

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败了")
                }
                // 否则就是获取文章分类列表成功了
                let htmlStr = template("tpl-cate", res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取选择的文件列表
    $('#coverFile').on('change', function(e) {
        let files = e.target.files
        if (files.length === 0) {
            // 长度为零即没有选择照片
            return
        }
        // 否则就是已经选择了照片，我们需要替换上用户所选择的页面
        let newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })


    let cate_state = '已发布'
        // 为存为草稿按钮绑定点击事件
    $('#btnSaveTwo').on('click', function() {
        cate_state = '草稿'
    })


    // 为form表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            // 基于form表单，快速创建一个formData对象
        let fd = new FormData($(this)[0])
        fd.append('state', cate_state)
        fd.forEach(function(v, k) {
            console.log(k, v)
        })

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })

    // 发起ajax请求  添加文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("添加文章失败了")
                }
                layer.msg("添加文章成功了")
                location.href = '/article/art_list.html'

            }
        })
    }
})