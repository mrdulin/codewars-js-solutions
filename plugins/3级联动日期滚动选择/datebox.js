;
$(function () {
    (function (w, d, $) {

        var $body = $('body');
        var version = '1.0.0';

        $.extend($.fn, {
            dateBox: function (options) {
                var options = $.extend({
                    'buttonText': '确定选择',
                    'headerText': '日期选择',
                    'startYear': 2000,
                    'setDateBtnHandler': null,
                    'dateFormat': 'yyyy-mm-dd'
                }, options);


                /* 年、月、日容器 */
                var $dateBox = this,
                    $dateBoxYearBox = $dateBox.find('.g-dateBox-year'),
                    $dateBoxMonthBox = $dateBox.find('.g-dateBox-month'),
                    $dateBoxDateBox = $dateBox.find('.g-dateBox-date');

                var isInit = $dateBox.$dateBoxCache ? false : true;
                if (isInit) {
                    showDateBox();
                }

                var liHeight = 30,
                    dayArray = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                _preventBodyTouchDefault();
                _renderComponent();

                var $dateMonthList = $dateBoxMonthBox.children(),
                    dateMonthListHeight = $dateMonthList.height(),
                    dateMonthListBottom = $dateBoxMonthBox.height() - dateMonthListHeight - 50;

                var $dateYearList = $dateBoxYearBox.children(),
                    dateYearListHeight = $dateYearList.height(),
                    dateYearListBottom = $dateBoxYearBox.height() - dateYearListHeight - 50;

                _initCurrentDate();
                _bindListEvent();

                /**
                 * @description 年，月列表，确定选择按钮注册事件监听
                 */
                function _bindListEvent() {
                    $dateMonthList.on('touchstart', _monthListTouchStartHandler);
                    $dateYearList.on('touchstart', _yearListTouchStartHandler);
                    $dateBox.on('touchend', '.u-setDate-btn', {
                        callBack: options.setDateBtnHandler
                    }, _setDateBtnHandler);
                }

                /**
                 * @description 确定选择按钮事件处理函数
                 * @param e 触摸事件
                 *
                 */
                function _setDateBtnHandler(e) {
                    var callBack = e.data.callBack || '';
                    var listOffsetTop = $dateBox.$dateDateList.position().top,
                        curLiIndex = Math.abs((listOffsetTop - 2 * liHeight) / 30);
                    $dateBox.date = _getCurSelectedDate(curLiIndex);
                    console.log($dateBox.year, $dateBox.month, $dateBox.date);
                    _dateFormat();
                    closeDateBox();
                    if ($.isFunction(callBack)) {
                        callBack();
                    }
                }

                /**
                 * @description 初始化当前时间
                 */
                function _initCurrentDate() {
                    var date = new Date(),
                        curMonth = date.getMonth() + 1,
                        curYear = date.getFullYear(),
                        curDate = date.getDate();

                    var monthTop = -curMonth * liHeight + 2 * liHeight,
                        yearTop = -(curYear - options.startYear - 2) * 30;

                    $dateMonthList.css('top', monthTop);
                    $dateYearList.css('top', yearTop);

                    $dateBox.year = curYear;
                    $dateBox.month = curMonth;
                    $dateBox.$dateDateList = _renderDate();

                    var dateTop = -curDate * liHeight + 2 * liHeight;
                    $dateBox.$dateDateList.css('top', dateTop);
                    _initCurrentDateStyle(curYear, curMonth, curDate);
                }

                /*
                 * @description 初始化今天日期样式
                 * @private
                 * @param curYear {Number} 当前年份
                 * @param curMonth {Number} 当前月份
                 * @param curDate {Number} 当前日期
                 * */
                function _initCurrentDateStyle(curYear, curMonth, curDate) {
                    var curYearIndex = curYear - options.startYear - 1,
                        curMonthIndex = curMonth - 1,
                        curDateIndex = curDate - 1,
                        i = 0;

                    var $curYearLi = $dateYearList.children().eq(curYearIndex),
                        $curMonthLi = $dateMonthList.children().eq(curMonthIndex),
                        $curDateLi = $dateBox.$dateDateList.children().eq(curDateIndex);

                    var curLiList = [$curYearLi, $curMonthLi, $curDateLi],
                        len = curLiList.length;

                    for (; i < len; i++) {
                        curLiList[i].css({
                            'background-color': '#2a2a2a',
                            'color': '#fff'
                        }).data('isSelected', true);
                    }
                }

                /**
                 * @description 渲染年、月列表，按钮，选择框，头部区域
                 *              日期列表需要判断闰年和平年
                 * @private
                 */
                function _renderComponent() {
                    var i = 0,
                        $monthList = $('<ul>'),
                        $yearList = $('<ul>'),
                        $setDateBtn = $('<button class="u-setDate-btn">' + options.buttonText + '</button>'),
                        $selectArea = $('<div class="g-select-area"></div>'),
                        $header = $('<h1 class="g-dateBox-hd">' + options.headerText + '</h1>');

                    for (; i < 12; i++) {
                        var month = i + 1,
                            $monthRow = $('<li>' + month + '</li>');
                        $monthRow.data('month', month)
                            .appendTo($monthList);
                    }
                    $dateBoxMonthBox.append($monthList);
                    i = 1;

                    for (; i <= 31; i++) {
                        var year = options.startYear + i,
                            $yearRow = $('<li>' + year + '</li>');

                        $yearRow.data('year', year)
                            .appendTo($yearList);
                    }
                    $dateBoxYearBox.append($yearList);

                    $dateBox.append($selectArea)
                        .append($setDateBtn)
                        .prepend($header);
                }


                /**
                 * @description 根据年份是闰年还是平年渲染当月日期
                 * @return $$dateList {Object} 返回日期列表jQuery对象
                 */
                function _renderDate() {
                    var $$$dateList = $dateBoxDateBox.children(),
                        isDateListExist = $$$dateList.length > 0;

                    var $dateRow = null;
                    if (!isDateListExist) {
                        var year = $dateBox.year,
                            month = $dateBox.month,
                            i = 1,
                            $dateList = $('<ul>');

                        var dateOfMonth = _isLeapYear(year, month);

                        for (; i <= dateOfMonth; i++) {
                            $dateRow = $('<li>' + i + '</li>');
                            $dateRow.data('date', i)
                                .appendTo($dateList);
                        }
                        $dateBoxDateBox.append($dateList);
                        var $$dateList = $dateBoxDateBox.children(),
                            dateDateListHeight = $$dateList.height(),
                            dateDateListBottom = $dateBoxDateBox.height() - dateDateListHeight - 50;

                        $$dateList.on('touchstart', {
                            dateDateListBottom: dateDateListBottom
                        }, _dateListTouchStartHandler);
                        return $$dateList;
                    } else {
                        var curDateOfMonth = $$$dateList.children().size(),
                            newDateOfMonth = _isLeapYear($dateBox.year, $dateBox.month),
                            dateDiffer = newDateOfMonth - curDateOfMonth,
                            j = 1;

                        if (dateDiffer > 0) {
                            for (; j <= dateDiffer; j++) {
                                var newDate = curDateOfMonth + j;
                                $dateRow = $('<li>' + newDate + '</li>');
                                $dateRow.data('date', newDate)
                                    .appendTo($$$dateList);
                            }
                        } else if (dateDiffer < 0) {
                            var count = Math.abs(dateDiffer);
                            var $toBeRemoveDates = $$$dateList.children().slice(curDateOfMonth - count);
                            $toBeRemoveDates.remove();
                            var listTop = $$$dateList.position().top;
                            var newListTop = listTop + count * liHeight;
                            $$$dateList.css('top', newListTop);
                            var curLiIndex = Math.abs((newListTop - 2 * liHeight) / 30);
                            _setSelectedStyle($$$dateList, curLiIndex);
                        }
                    }
                }

                /**
                 * @description 判断是闰年还是平年
                 * @param {Number} year 年份
                 * @param {Number} month 月份
                 * @return {Number} 返回闰年的2月天数，或者返回平年某个月的天数
                 */
                function _isLeapYear(year, month) {
                    return (month === 2 && year % 4 === 0 && year % 100 === 0) || (year % 400 === 0) ? 28 : dayArray[month];
                }

                /**
                 * @description 获取用户选择的年份
                 * @param liIndex {Number} 用户选择的年份对应的DOM元素索引
                 * @return curSelectedYear {Number} 返回用户选择的年份
                 */
                function _getCurSelectedYear(liIndex) {
                    var $curYearLi = $dateYearList.children().eq(liIndex - 1),
                        curSelectedYear = $curYearLi.data('year');
                    return curSelectedYear;
                }

                /**
                 * @description 获取用户选择的月份
                 * @param {Number} liIndex 用户选择的月份对应的DOM元素索引
                 * @return {Number} curSelectedMonth 返回用户选择的月份
                 */
                function _getCurSelectedMonth(liIndex) {
                    var $curMonthLi = $dateMonthList.children().eq(liIndex - 1),
                        curSelectedMonth = $curMonthLi.data('month');
                    return curSelectedMonth;
                }

                /**
                 * @description 获取用户选择的日期
                 * @param {Number} liIndex 用户选择的日期对应的DOM元素索引
                 * @return {Number} curSelectedDate 返回用户选择的日期
                 */
                function _getCurSelectedDate(liIndex) {
                    var $curDateLi = $dateBox.$dateDateList.children().eq(liIndex - 1),
                        curSelectedDate = $curDateLi.data('date');
                    return curSelectedDate;
                }

                /**
                 * @description 滚动日期列表，滚动停止时，设置选中日期样式
                 * @param index 当前选择的li索引
                 * @param $list 年，月，日列表
                 * @private
                 */
                function _setSelectedStyle($list, index) {
                    var $curLi = $list.children().eq(index - 1),
                        isSelected = $curLi.data('isSelected');
                    if (!isSelected) {
                        $curLi
                            .siblings()
                            .css({
                                'background-color': '#fff',
                                'color': '#000'
                            })
                            .removeData('isSelected')
                            .end()
                            .css({
                                'background-color': '#2a2a2a',
                                'color': '#fff'
                            })
                            .data('isSelected', true);
                    }
                }

                /**
                 * @description 阻止在移动浏览器上body上下回弹
                 * @private
                 */
                function _preventBodyTouchDefault() {
                    $body.on('touchmove', function (e) {
                        e.preventDefault();
                    });
                }

                /**
                 * @descrption 月份列表触摸开始事件
                 * @param e
                 * @private
                 */
                function _monthListTouchStartHandler(e) {
                    e.preventDefault();
                    var $monthList = $(this);
                    var changedTouches = e.originalEvent.changedTouches;
                    var listOffsetY = $monthList.position().top;
                    var touchstartY = changedTouches[0].clientY;

                    _touchmoveHandler($dateBoxMonthBox, listOffsetY, touchstartY, dateMonthListBottom, 1);
                }

                /**
                 * @descrption 年份列表触摸开始事件
                 * @param e
                 * @private
                 */
                function _yearListTouchStartHandler(e) {
                    e.preventDefault();
                    var $yearList = $(this);
                    var changedTouches = e.originalEvent.changedTouches;
                    var listOffsetY = $yearList.position().top;
                    var touchstartY = changedTouches[0].clientY;

                    _touchmoveHandler($dateBoxYearBox, listOffsetY, touchstartY, dateYearListBottom, 0);
                }

                /**
                 * @descrption 日期列表触摸开始事件
                 * @param e
                 * @private
                 */
                function _dateListTouchStartHandler(e) {
                    e.preventDefault();
                    var $dateList = $(this),
                        dateDateListBottom = e.data.dateDateListBottom;
                    var changedTouches = e.originalEvent.changedTouches;
                    var listOffsetY = $dateList.position().top;
                    var touchstartY = changedTouches[0].clientY;

                    _touchmoveHandler($dateBoxDateBox, listOffsetY, touchstartY, dateDateListBottom, 2);
                }

                /**
                 * @description 触摸移动处理函数
                 * @param $box 年，月，日容器
                 * @param listOffsetY 年，月，日列表相对于容器的top值
                 * @param touchstartY 触摸开始相对于视口的Y坐标
                 * @param listBottom 年，月，日列表距离容器的最大bottom值
                 * @param dateType {Number} 日期类型，0：表示年;1:表示月;
                 * @private
                 */
                function _touchmoveHandler($box, listOffsetY, touchstartY, listBottom, dateType) {
                    var $list = $box.children();
                    _preventBodyTouchDefault();
                    $box.on('touchmove', function (e) {
                        e.preventDefault();
                        var changedTouches = e.originalEvent.changedTouches;
                        var mousemoveY = changedTouches[0].clientY;
                        var listTop = mousemoveY - touchstartY + listOffsetY;
                        if (listTop >= 30) {
                            listTop = 30;
                        } else if (listTop <= listBottom) {
                            listTop = listBottom;
                        } else {
                            var liIndex = Math.round(listTop / liHeight);
                            listTop = liIndex * liHeight;
                        }

                        $list.css('top', listTop);
                        $body.on('touchend', {
                            $list: $list,
                            dateType: dateType
                        }, _touchendHandler);
                    });
                }

                /**
                 * @description 触摸结束处理函数
                 * @private
                 */
                function _touchendHandler(e) {
                    e.preventDefault();
                    var $list = e.data.$list,
                        dateType = e.data.dateType;
                    var listOffsetTop = $list.position().top;
                    var curLiIndex = Math.abs((listOffsetTop - 2 * liHeight) / 30);
                    _setSelectedStyle($list, curLiIndex);

                    $body.off();
                    switch (dateType) {
                        case 0:
                            $dateBox.year = _getCurSelectedYear(curLiIndex);
                            break;
                        case 1:
                            $dateBox.month = _getCurSelectedMonth(curLiIndex);
                            break;
                        case 2:
                            $dateBox.date = _getCurSelectedDate(curLiIndex);
                            break;
                        default:
                            break;
                    }
                    _renderDate();
                }

                /**
                 * @description 格式化日期控件日期,并将格式化的日期赋值给日期控件fullDate属性，用户可以通过
                 *              该属性，取得选定的日期
                 */
                function _dateFormat() {
                    var dateArr = [$dateBox.year, $dateBox.month, $dateBox.date];
                    $dateBox.fullDate = dateArr.join('-');
                }

                /**
                 * @description 关闭日期控件
                 */
                function closeDateBox() {
                    $dateBox.$dateBoxCache = $dateBox.detach();
                    console.log(111);
                }

                /**
                 * @description 打开日期控件
                 */
                function showDateBox() {
                    $body.append($dateBox.$dateBoxCache);
                    console.log(222);
                }

                this.closeDateBox = closeDateBox;
                this.showDateBox = showDateBox;
                return this;
            }
        });

    })(window, document, jQuery);
});