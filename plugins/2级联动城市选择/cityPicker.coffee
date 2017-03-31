(($, window, document)->

    $.fn.rollerPicker = (options) ->
        defaults =
            url: ''
            num: 2
            title: '请选择所在地区'
            initConfig:
                province: '请选择'
                city: '请选择'
            callback: ->

        @.options = options
        isMove = false

        class Plugin
            constructor: (self) ->
                @settings = $.extend({}, defaults, self.options) if $.isPlainObject(self.options)
                @$rollerCtn = self
                @init()
                return
            init: ->
                @$rollerListBox = @$rollerCtn.find '.m-roller-box'
                @renderStaticComponents()
                .renderRollerList()
                @requestData(=>
                    @.renderData()
                    .cacheVar()
                    .setStyles()
                    .bindEvent()
                    .initRollerPos()
                    return
                )
                return @
            #渲染头部及头部按钮
            renderStaticComponents: ->
                $mRollerTt = '<div class="m-roller-tt">' +
                                '<a class="u-btn-cancel">取消</a>' +
                                '<h4 class="u-roller-tt">' + @settings.title + '</h4>' +
                                '<a class="u-btn-confirm">确认</a>' +
                             '</div>'
                $mSctArea = '<div class="u-sct-area"></div>'
                @$rollerCtn.prepend($mRollerTt).append($mSctArea)
                return @
            #渲染滚动列表,根据num参数,渲染1级，2级，3级等不同级别的滚动列表
            renderRollerList: ->
                for i in [0..@settings.num - 1]
                    $mRollerBox = $('<div class="m-roller-ctn"></div>')
                    $mRollerList = $('<ul class="m-roller-list"></ul>').data('listIndex', i)
                    @$rollerListBox.append $mRollerBox
                    $mRollerBox.append $mRollerList
                return @
            #设置插件部分组件的样式
            setStyles: ->
                w = 100 / @settings.num + '%'
                $('.m-roller-ctn').css('width', w)
                @$rollerList.css({y: @listMaxTopOffset})
                $('.u-sct-area').css('top', @viewHeight / 2 + @itemHeight + 'px')
                return @
            #请求接口数据
            requestData: (callback)->
                that = @
                $.ajax({
                    url: @settings.url
                    type: 'POST'
                    dataType: 'json'
                    success: (data, status, jqxhr)->
                        if data and $.isFunction(callback)
                            that.data = data.data.tree
                            callback()
                        return
                    error: (xhr, status, err)->
                        alert '请求数据出错'
                        return
                    complete: ->
                        return
                })
                return @
            #渲染数据
            renderData: ->
                @$rollerList = $('.m-roller-list', @$rollerCtn)
                $provinceList = @$rollerList.eq(0)
                $cityList = @$rollerList.eq(1)
                if not arguments.length
                    for provinceObj, i in @.data
                        $provinceItem = $('<li>' + provinceObj.value + '</li>').data('obj', provinceObj)
                        $provinceList.append $provinceItem
                if $.isArray(arguments[0])
                    $cityList.empty()
                    for cityObj, j in arguments[0]
                        $cityItem = $('<li>' + cityObj.value + '</li>').data('obj', cityObj)
                        $cityList.append($cityItem)

                    $cityList.css({y: arguments[1]})
                return @
            #缓存变量
            cacheVar: ->
                @$rollerBox = @$rollerListBox.find('.m-roller-ctn')
                @$rollerList = @$rollerBox.find('.m-roller-list')
                @itemHeight = @$rollerList.children().first().height()
                @viewHeight = @$rollerListBox.height()
                @listMaxTopOffset = (@viewHeight - @itemHeight) / 2
                @listMaxBottomOffset = @$rollerList.height() - (@listMaxTopOffset + @itemHeight)
                @$btnCancel = $('.u-btn-cancel', @$rollerCtn)
                @$btnConfirm = $('.u-btn-confirm',@$rollerCtn)
                @$d = $(document)
                return @
            #绑定DOM元素事件
            bindEvent: ->
                that = @
                @$rollerBox.on('mousedown touchstart', that.moveStartHandler.bind(that))
                @$btnConfirm.on('click', that.btnConfirmHandler.bind(that))
                @$btnCancel.on('click', that.btnCancelHandler.bind(that))
                return @
            #滚动开始事件处理
            moveStartHandler: (e)->
                evt = e or event
                evt.stopPropagation()
                oCurRollerBox = evt.currentTarget
                $curRollerBox = $(oCurRollerBox)
                $curRollerList = $curRollerBox.find('ul')
                curY = parseInt($curRollerList.css('y').replace('px', ''))
                mdOffsetY
                @.updateListMaxBottomOffset($curRollerList)
                mdOffsetY = evt.clientY if evt.type is 'mousedown'
                mdOffsetY = evt.originalEvent.targetTouches[0].clientY if evt.type is 'touchstart'

                if isMove = true
                    @._preventDocumentTouchDefault(evt)
                    that = @
                    $curRollerBox.on('mousemove touchmove', {
                        curY: curY
                        mdOffsetY: mdOffsetY
                        box: $curRollerBox
                    }, that.movingHandler.bind(that))
                    @$d.on('mouseup touchend', {
                        box: $curRollerBox
                    }, that.moveEndHandler.bind(that))
                return
            #滚动中事件处理
            movingHandler: (e)->
                evt = e or event
                evt.stopPropagation()
                mmOffsetY
                mmDistance
                y
                $curRollerBox = evt.data.box
                curY = evt.data.curY
                $curRollerList = $curRollerBox.find('ul')

                mmOffsetY = evt.clientY if evt.type is 'mousemove'
                mmOffsetY = evt.originalEvent.targetTouches[0].clientY if evt.type is 'touchmove'
                mmDistance = mmOffsetY - evt.data.mdOffsetY
                y = curY + mmDistance

                if y >= @listMaxTopOffset
                    y = @listMaxTopOffset
                else if y < -@listMaxBottomOffset
                    y = -@listMaxBottomOffset

                $curRollerList.css({y: y})

                return
            #滚动结束事件处理
            moveEndHandler: (e)->
                evt = e or event
                evt.stopPropagation()
                $curRollerBox = evt.data.box

                @$d.off('mouseup touchend')
                $curRollerBox.off('mousemove touchmove')
                isMove = false
                @._fixRollerListTop($curRollerBox)
                return

            initRollerPos: ->
                $items
                initProvince = @settings.initConfig.province
                initCity = @settings.initConfig.city
                data
                that = @
                _setMarginTop = (index) ->
                    pos = index * that.itemHeight
                    curPos = parseInt(@.css('y').replace('px', ''))
                    @.css({y: curPos - pos})
                    return

                for elem, index in @$rollerList
                    $items = $(elem).children()
                    for el, idx in $items
                        data = $(el).data('obj').value
                        if (index is 0 and initProvince is data) or (index is 1 and initCity is data)
                            _setMarginTop.call($(elem), idx)
                            that.linkAge($(elem))
                return @
            #滚动联动处理
            linkAge: ($rollerList) ->
                itemIndex = @._getCurrentItemIndex($rollerList)
                listIndex = $rollerList.data('listIndex')
                if listIndex is 0
                    $curItem = $rollerList.children().eq(itemIndex- 1)
                    $curItemKey = $curItem.data('obj').key
                    $nextRollerList = $rollerList.parent().next().find('ul')

                    @._setSelectItemStyle.call($curItem)
                    for provinceObj, index in @data
                        if $curItemKey is provinceObj.key
                            cityList = provinceObj.list

                    @.renderData.call($nextRollerList, cityList, @listMaxTopOffset)
                    nextItemIndex = @._getCurrentItemIndex($nextRollerList)
                    $nextItem = $nextRollerList.children().eq(nextItemIndex - 1)
                    @._setSelectItemStyle.call($nextItem)
                if listIndex is 1
                    $nextItem = $rollerList.children().eq(itemIndex - 1)
                    @._setSelectItemStyle.call($nextItem)
                return
            btnConfirmHandler: =>
                if @$rollerCtn.exportData and @$rollerCtn.exportData.length > 0
                    @$rollerCtn.exportData.length = 0
                @.hide()
                if $.isFunction(@settings.callback)
                    @settings.callback.call(@$rollerCtn, @._getSelectData())
                return
            btnCancelHandler: ->
                @.hide()
                return
            _getSelectData: ->
                $rList
                $item
                itemIndex
                for i in [0..@settings.num - 1]
                    console.log(i)
                    $rList = @$rollerList.eq(i)
                    itemIndex = @._getCurrentItemIndex($rList)
                    $item = $rList.children().eq(itemIndex - 1)
                    $item.data('obj')
            updateListMaxBottomOffset: ($rollerList)->
                @listMaxBottomOffset = $rollerList.height() - (@listMaxTopOffset + @itemHeight)
                return
            show: ->
                @$rollerCtn.show()
                return
            hide: ->
                @$rollerCtn.hide()
                return
            _fixRollerListTop: ($rlBox)->
                $rlList = $rlBox.find('ul')
                curTop = parseInt($rlList.css('y').replace('px', ''))
                curItemNum
                fixY
                curItemNum = Math.round((@listMaxTopOffset + @itemHeight - curTop) / @itemHeight)
                fixY = @listMaxTopOffset - (curItemNum - 1) * @itemHeight
                $rlList.transition({
                    y: fixY + 'px'
                    duration: 200
                    easing: 'linear'
                    complete: =>
                        @.linkAge($rlList)
                })
                return
            _setSelectItemStyle: ->
                $item = @
                $item.siblings().removeAttr('class').end().addClass('select')
                return
            _setDateItemStyle: ->
                dItemIndex = @._getCurrentItemIndex(@$rollerList.eq(2))
                $dItem = @$rollerList.eq(2).children().eq(dItemIndex - 1)
                @._setSelectItemStyle.call($dItem)
                return
            _getCurrentItemIndex:($rollerList) ->
                top = parseInt($rollerList.css('y').replace('px', ''))
                Math.round((@listMaxTopOffset + @itemHeight - top) / @itemHeight)
            _preventDocumentTouchDefault: (e)->
                that = @
                @$d.on('touchmove mousemove', ->
                    that._stopEvent(e)
                )
                return
            _stopEvent: (e)->
                e.stopPropagation()
                e.preventDefault()
                return
        new Plugin(this)
        return
    return this
)(jQuery, window, document)