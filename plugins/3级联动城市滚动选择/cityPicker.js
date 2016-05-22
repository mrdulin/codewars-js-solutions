;
(function ($, window, document) {

    $.extend($.fn, {
        rollerPicker: function (options) {

            var defaults = {
                num: 3,
                type: 'city',
                url: '',
                startYear: 1900,
                endYear: new Date().getFullYear(),
                initConfig: {
                    province: '上海市',
                    city: '上海市',
                    town: '',
                    year: 1950,
                    month: 1,
                    date: 1
                },
                callback: function () {

                }
            };

            var settings,
                method,
                params,
                isMove = false,
                timer,
                listMaxTopOffset,
                listMaxBottomOffset,
                viewHeight,
                $rollerCtn = this,
                $rollerListBox = $rollerCtn.find('.m-roller-box'),
                $rollerList,
                $rollerBox,
                $btnCancel,
                $btnConfirm,
                reqData,
                itemHeight,
                exportData = [],
                daysOfMonth = [0, 31, 29, 31, 30, 31, 30, 31, 30, 30, 31, 30, 31],
                title,
                msTime,
                meTime,
                v,
                msPosY,
                mePosY,
                stopInertiaMove = false,
                $d;

            var methods = {

                /**
                 * 初始化，合并默认和用户配置参数
                 * @param _options
                 * @returns {methods}
                 */
                init: function (_options) {
                    var cityCallback = function () {
                        _initRollerDom();
                        _initVariable();
                        _initRollerStyle();
                        _startRollerLinkage($rollerBox.children().eq(0));
                        _initRollerPos();
                        _bindEvent();
                    };
                    var dateCallback = function () {
                        _initRollerDom();
                        _initVariable();
                        _initRollerStyle();
                        _startDateRollerLinkage($rollerBox.children().eq(1));
                        _bindEvent();
                    };
                    settings = $.extend({}, defaults, _options);
                    if (settings.type === 'city') {
                        title = '选择所在地区';
                        _requestData(cityCallback);
                    }
                    if (settings.type === 'date') {
                        title = '选择出生日期';
                        dateCallback();
                    }

                    return this;
                },

                //public methods

                destroy: function () {
                    this.remove();
                },

                show: function () {
                    this.show();
                },

                hide: function () {
                    this.hide();
                }

            };

            if ($.isFunction(methods[options])) {
                method = methods[options];
                params = Array.prototype.slice.call(arguments, 1);
                return method.apply(this, params);
            } else if ($.isPlainObject(options)) {
                return methods.init.call(this, options);
            } else {
                $.error('Method ' + options + ' does not exist on jQuery.rollerPicker');
            }

            /**
             * 请求数据
             * @param callback 请求成功回调函数，请求成功后执行其他初始化操作
             * @private
             */
            function _requestData(callback) {
                var url = settings.url;
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            reqData = data;
                            callback();
                        }
                    },
                    error: function () {
                        alert('请求数据出错');
                    }
                });
            }

            /**
             * 初始化插件的dom元素,包括滚动列表，滚动列表容器，选择区域
             * @private
             */
            function _initRollerDom() {
                var num = settings.num,
                    $mRollerTt = '<div class="m-roller-tt">' +
                        '<a class="u-btn-cancel">取消</a>' +
                        '<h4 class="u-roller-tt">' + title + '</h4>' +
                        '<a class="u-btn-confirm">确认</a>' +
                        '</div>',
                    $mRollerBox,
                    $mSctArea = '<div class="u-sct-area"></div>',
                    $mRollerList,
                    provinces = [],
                    i = 0;
                for (; i < num; i++) {
                    $mRollerBox = $('<div class="m-roller-ctn">' +
                        '</div>');
                    $mRollerList = $('<ul class="m-roller-list"></ul>').data('listIndex', i);
                    $rollerListBox.append($mRollerBox);
                    $mRollerBox.append($mRollerList);
                    if (!i) {
                        if (settings.type === 'city') {
                            $.each(reqData, function (k) {
                                provinces.push(k);
                            });
                            _renderEachData.call($mRollerList, provinces);
                        }
                        if (settings.type === 'date') {
                            _renderEachData.call($mRollerList, 'year');
                        }
                    }
                    if (settings.type === 'date' && i === 1) {
                        _renderEachData.call($mRollerList, 'month');
                    }
                }
                $rollerCtn.append($mSctArea);
                $rollerCtn.prepend($mRollerTt);
            }


            /**
             * 渲染滚动列表数据，重置滚动列表位置
             * @param dataList 数组类型数据
             * @private
             */
            function _renderEachData(dataList) {
                var $mRollerList = this,
                    i = 0,
                    j = 1,
                    k = 1,
                    len = settings.endYear - settings.startYear,
                    year,
                    $item;
                $mRollerList.empty().css('marginTop', listMaxTopOffset + 'px');
                if ($.isArray(dataList)) {
                    $.each(dataList, function (index, elem) {
                        $item = $('<li>' + elem + '</li>').data('data', elem);
                        $mRollerList.append($item);
                    });
                } else if (arguments[0] === 'year') {
                    for (; i <= len; i++) {
                        year = settings.startYear + i;
                        $item = $('<li>' + year + '年</li>').data('data', year);
                        $mRollerList.append($item);
                    }
                } else if (arguments[0] === 'month') {
                    for (; j <= 12; j++) {
                        $item = $('<li>' + j + '月</li>').data('data', j);
                        $mRollerList.append($item);
                    }
                } else if (arguments[0] === 'date') {
                    for (; k <= arguments[1]; k++) {
                        $item = $('<li>' + k + '日</li>').data('data', k);
                        $mRollerList.append($item);
                    }
                }
            }

            /**
             * 初始化滚动列表位置
             * @private
             */
            function _initRollerStyle() {
                $rollerList.css('marginTop', listMaxTopOffset + 'px');
                $('.u-sct-area').css('top', viewHeight / 2 + itemHeight + 'px');
                if (settings.type === 'date') {
                    $rollerList.css('fontSize', '20px');
                }
            }

            function _initRollerPos() {
                var $items,
                    initProvince = settings.initConfig.province,
                    initCity = settings.initConfig.city,
                    initTown = settings.initConfig.town,
                    data;
                $rollerList.each(function (index, elem) {
                    $items = $(elem).children();
                    $items.each(function (idx, el) {
                        data = $(el).data('data');
                        if (index === 0 && initProvince === data) {
                            _setMarginTop.call($(elem), idx);
                            _startRollerLinkage($(elem));
                        }
                        if (index === 1 && initCity === data) {
                            _setMarginTop.call($(elem), idx);
                            _startRollerLinkage($(elem));
                        }
                        if (index === 2 && initTown === data) {
                            _setMarginTop.call($(elem), idx);
                            _setSelectItemStyle.call($(el));
                        }
                    })
                });

                function _setMarginTop(index) {
                    var curPos,
                        pos = index * itemHeight;
                    curPos = this.css('marginTop').replace('px', '');
                    this.css('marginTop', curPos - pos + 'px');
                }
            }

            /**
             * 初始化作用域在整个插件中的变量
             * @private
             */
            function _initVariable() {
                var $item;
                $rollerBox = $rollerListBox.children('.m-roller-ctn');
                $rollerList = $rollerBox.find('ul');
                $item = $rollerList.children().first();
                itemHeight = $item.height();
                viewHeight = $rollerListBox.height();
                console.log(viewHeight);
                listMaxTopOffset = (viewHeight - itemHeight) / 2;
                listMaxBottomOffset = $rollerList.height() - (listMaxTopOffset + itemHeight);
                $btnCancel = $('.u-btn-cancel', $rollerCtn);
                $btnConfirm = $('.u-btn-confirm', $rollerCtn);
                $d = $(document);
            }

            /**
             * 渲染2级，3级滚动列表后，需要更新该列表滚动距离底部的最大距离
             * @param $rollerList 2级，3级滚动列表
             * @private
             */
            function _updateListMaxBottomOffset($rollerList) {
                listMaxBottomOffset = $rollerList.height() - (listMaxTopOffset + itemHeight);
            }

            /**
             * 绑定滚动列表滚动开始事件
             * @private
             */
            function _bindEvent() {
                $rollerBox.on('mousedown touchstart', _moveStartHandler);
                $btnConfirm.on('click touchstart', _btnConfirmHandler);
                $btnCancel.on('click touchstart', _btnCancelHandler);
            }

            /**
             * 确认按钮事件处理
             * @private
             */
            function _btnConfirmHandler() {
                $rollerCtn.exportData = _getSelectData();
                console.log($rollerCtn.exportData);
                methods.hide.call($rollerCtn);
                if ($.isFunction(settings.callback)) {
                    settings.callback();
                }
                exportData.length = 0;
            }

            /**
             * 取消按钮事件处理
             * @private
             */
            function _btnCancelHandler() {
                methods.hide.call($rollerCtn);
            }

            /**
             * 获得当前选择的地区数据
             * @returns {Array}
             * @private
             */
            function _getSelectData() {
                var $rList,
                    $item,
                    itemIndex;
                for (var i = 0; i < settings.num; i++) {
                    $rList = $rollerList.eq(i);
                    itemIndex = _getCurrentItemIndex($rList);
                    $item = $rList.children().eq(itemIndex - 1);
                    exportData.push($item.data('data'));
                }
                return exportData;
            }

            /**
             * 滚动开始处理函数，并在当前滚动列表容器上绑定'mousemove', 'touchmove'事件
             * 在document上绑定滚动结束事件
             * @param e
             * @private
             */
            function _moveStartHandler(e) {
                var evt = e || event,
                    oCurRollerBox = evt.currentTarget,
                    $curRollerBox = $(oCurRollerBox),
                    $curRollerList = $curRollerBox.find('ul'),
                    curY = parseInt($curRollerList.css('marginTop').replace('px', ''), 10),
                    mdOffsetY;
                _updateListMaxBottomOffset($curRollerList);
                clearTimeout(timer);
                if (e.type === 'mousedown') {
                    mdOffsetY = evt.clientY;
                }
                if (e.type === 'touchstart') {
                    mdOffsetY = evt.originalEvent.targetTouches[0].clientY;
                }
                if (isMove = true) {
                    _preventDocumentTouchDefault();
                    $curRollerBox.on('mousemove touchmove', {
                        curY: curY,
                        mdOffsetY: mdOffsetY,
                        box: $curRollerBox
                    }, _movingHandler);
                    $d.on('mouseup touchend', {
                        box: $curRollerBox
                    }, _moveEndHandler);
                }

                msPosY = mdOffsetY;
                msTime = e.timeStamp || new Date().getTime();
                stopInertiaMove = true;
            }

            /**
             * 滚动中处理函数
             * @param e
             * @private
             */
            function _movingHandler(e) {
                var evt = e || event,
                    mmOffsetY,
                    mmDistance,
                    y,
                    $curRollerBox = evt.data.box,
                    curY = evt.data.curY,
                    $curRollerList = $curRollerBox.find('ul');

                if (evt.type === 'mousemove') {
                    mmOffsetY = evt.clientY;
                }
                if (evt.type === 'touchmove') {
                    mmOffsetY = evt.originalEvent.targetTouches[0].clientY;
                }
                mmDistance = mmOffsetY - evt.data.mdOffsetY;
                y = curY + mmDistance;

                if (y >= listMaxTopOffset) {
                    y = listMaxTopOffset;
                } else if (y < -listMaxBottomOffset) {
                    y = -listMaxBottomOffset;
                }
                $curRollerList.css('marginTop', y + 'px');

                var nowTime = e.timeStamp || Date.now();
                stopInertiaMove = true;
                if (nowTime - msTime > 300) {
                    msTime = nowTime;
                    msPosY = mmOffsetY;
                }
            }

            /**
             * 滚动结束处理函数，调用_fixRollerListTop函数，修正滚动位置
             * @param e
             * @private
             */
            function _moveEndHandler(e) {
                var evt = e || event,
                    $curRollerBox = evt.data.box,
                    meOffsetY;

                $d.off();
                $curRollerBox.off('mousemove touchmove');
                isMove = false;
                _fixRollerListTop($curRollerBox);
                if (evt.type === 'mouseup') {
                    meOffsetY = evt.clientY;
                }
                if (evt.type === 'touchend') {
                    meOffsetY = evt.originalEvent.changedTouches[0].clientY || evt.originalEvent.targetTouches[0].clientY;
                }
                mePosY = meOffsetY;
                meTime = e.timeStamp || new Date().getTime();
                v = (mePosY - msPosY) / (meTime - msTime);
            }

            /**
             * 设置当前选择的样式
             * @private
             */
            function _setSelectItemStyle() {
                var $item = this;
                $item.siblings().removeAttr('class').end().addClass('select');
            }

            /**
             * 滚动联动处理函数，渲染2级，3级数据
             * @param $rollerList 当前滚动列表
             * @private
             */
            function _startRollerLinkage($rollerList) {
                var itemIndex = _getCurrentItemIndex($rollerList),
                    listIndex = $rollerList.data('listIndex'),
                    $curItem = $rollerList.children().eq(itemIndex - 1),
                    $curItemKey = $curItem.data('data'),
                    cities = [],
                    towns = [],
                    $nextRollerList = $rollerList.parent().next().find('ul'),
                    nnIndex,
                    $nnItem;

                $rollerList.data('curItemKey', $curItemKey);
                _setSelectItemStyle.call($curItem);
                switch (listIndex) {
                    case 0:
                        $.each(reqData, function (k, v) {
                            if ($curItemKey === k) {
                                $.each(v, function (key) {
                                    cities.push(key);
                                });
                            }
                        });
                        _renderEachData.call($nextRollerList, cities);
                        _startRollerLinkage.call(this, $nextRollerList);
                        break;
                    case 1:

                        $.each(reqData, function (k, v) {
                            if ($rollerBox.children().eq(listIndex - 1).data('curItemKey') === k) {
                                $.each(v, function (key, val) {
                                    if ($curItemKey === key) {
                                        $.each(val, function (index, elem) {
                                            towns.push(elem);
                                        });
                                    }
                                });
                            }
                        });
                        _renderEachData.call($nextRollerList, towns);
                        nnIndex = _getCurrentItemIndex($nextRollerList);
                        $nnItem = $nextRollerList.children().eq(nnIndex - 1);
                        _setSelectItemStyle.call($nnItem);
                        break;
                    default:
                        break;
                }

            }

            /**
             * 日期滚动联动处理函数
             * @param $mList
             * @private
             */
            function _startDateRollerLinkage($mList) {
                var mItemIndex = _getCurrentItemIndex($mList),
                    $monthItem = $mList.children().eq(mItemIndex - 1),
                    month = $monthItem.data('data'),
                    $yList = $mList.parent().prev().find('ul'),
                    yItemIndex = _getCurrentItemIndex($yList),
                    $yearItem = $yList.children().eq(yItemIndex - 1),
                    year = $yearItem.data('data'),
                    dayOfMonthCount = _getDayOfMonthCount(year, month);

                _setSelectItemStyle.call($monthItem);
                _setSelectItemStyle.call($yearItem);
                _renderEachData.call($rollerBox.children().eq(2), 'date', dayOfMonthCount);
                _setDateItemStyle();
            }

            /**
             * 设置日期第3级滚动样式
             * @private
             */
            function _setDateItemStyle() {
                var dItemIndex = _getCurrentItemIndex($rollerBox.children().eq(2)),
                    $dItem = $rollerBox.children().eq(2).children().eq(dItemIndex - 1);
                _setSelectItemStyle.call($dItem);
            }

            /**
             * 判断是闰年还是平年，并返回对应月份的天数
             * @param year 年
             * @param month 月
             * @returns {number} 对应月份的天数
             * @private
             */
            function _getDayOfMonthCount(year, month) {
                return (month === 2 && ((year % 100 === 0 && year % 4 === 0) || year % 400 === 0)) ? 28 : daysOfMonth[month];
            }

            /**
             * 获取当前滚动列表当前选择的条目索引
             * @param $rollerList 当前滚动列表
             * @returns {number} 当前选择的条目索引
             * @private
             */
            function _getCurrentItemIndex($rollerList) {
                var top = parseInt($rollerList.css('marginTop').replace('px', ''), 10);
                return Math.round((listMaxTopOffset + itemHeight - top) / itemHeight);
            }


            /**
             * 修正滚动列表位置处理函数
             * @param $rlBox 当前滚动列表
             * @private
             */
            function _fixRollerListTop($rlBox) {
                var $rlList = $rlBox.find('ul'),
                    curTop = parseInt($rlList.css('marginTop').replace('px', ''), 10),
                    curItemNum,
                    fixY;
                curItemNum = Math.round((listMaxTopOffset + itemHeight - curTop) / itemHeight);
                fixY = listMaxTopOffset - (curItemNum - 1) * itemHeight;
                timer = setTimeout(function () {
                    $rlList.animate({
                        'marginTop': fixY + 'px'
                    }, 'fast', function () {
                        settings.type === 'city' ?
                            _startRollerLinkage($rlList) :
                            ($rlList.data('listIndex') !== 2 ? _startDateRollerLinkage($rollerBox.children().eq(1)) : _setDateItemStyle());
                    });
                }, 1);
            }

            /**
             * 禁止document的touchmove和mousemove事件
             * @private
             */
            function _preventDocumentTouchDefault() {
                $d.on('touchmove mousemove', function (e) {
                    _stopEvent(e);
                });
            }

            /**
             * 阻止事件冒泡和事件在浏览器中的默认行为
             * @param e
             * @private
             */
            function _stopEvent(e) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    })
})(jQuery, window, document);
