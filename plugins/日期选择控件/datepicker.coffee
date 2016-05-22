do (window, document, jQuery) ->
    $ = jQuery
    w = window
    d = document

    weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    monthDay = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    beginDateArr = null
    endDateArr = null
    renderEndDateArr = null
    renderMonthCount = 12
    initDateObj = null
    datePickerDataList = null

    dataTpl =
        code: '1'
        'data|30': [
            {
                aperiodicDesc: "",
                'sellPrice|200-2000': 200,
                specDate: "2015-01-17",
                stock: 0,
                stockFlag: true
            }
        ]
        errorMessage: "",
        message: "",
        version: "92dff364a20501fcbd142db54ff8e8e3"

    $.fn.datePicker = (options)->
        defaults =
            url: ''
            title: '选择日期'
            begin: ''
            end: ''
            callback: ->

        class Plugin
            constructor: (self, options) ->
                @settings = $.extend({}, defaults, options)
                @$dpCtn = self
                @dateArray = []
                @init()
            init: ->
                beginDateArr = @getBeginDate()
                endDateArr = @getEndDate()
                renderEndDateArr = @getRenderEndDate()
                @hide()
                @renderStaticDom()
                @requestData(=>
                    @factoryDateData()
                    @renderDateData()
                    @bindEvent()
                    @emitSelectedDateData(initDateObj)
                    return
                )
                return
            bindEvent: ->
                that = @
                $('.u-back-btn').on('click touchend', that.backButtonClickHandler)
                $('.m-dp-d').on('click touchend', 'span', that.dateClickHandler)
                return
            dateClickHandler:(e) =>
                evt = e || event
                target = evt.target
                $dateDom
                if target.nodeName.toLocaleUpperCase() isnt 'SPAN'
                    $dateDom = $(target).closest('span')
                else
                    $dateDom = $(target)

                dateObj = $dateDom.data('dateInfo')
                cls = 'selected'
                $allDateDom = $('.m-dp-d').find('span')
                if dateObj.isUsable
                    @emitSelectedDateData(dateObj)
                    if !$dateDom.hasClass(cls)
                        $allDateDom.removeClass(cls)
                        $dateDom.addClass(cls)
                return
            emitSelectedDateData: (dateObj)->
                @$dpCtn.dateObj = dateObj
                fn = @settings.callback
                if $.isFunction fn
                    fn.call(@$dpCtn, dateObj)
                @hide()
                console.log @$dpCtn.dateObj
                return
            backButtonClickHandler: =>
                @hide()
                return
            formatDate: (date) ->
                dateArr = date.concat()
                yyyy
                mm
                dd
                if $.isArray dateArr
                    yyyy = dateArr[0] + ''
                    if (dateArr[1] + '').length is 1
                        mm = '0' + dateArr[1]
                    else
                        mm = '' + dateArr[1]

                    if (dateArr[2] + '').length is 1
                        dd = '0' + dateArr[2]
                    else
                        dd = '' + dateArr[2]
                yyyy + '-' + mm + '-' + dd
            renderDateData: ->
                $mCtn = @$dpCtn.find 'article'
                $mCtn.empty()

                for obj, index in @dateArray
                    $dDom = null
                    $mDom = $("""
                            <section class="m-dp-date">
                                <p>#{obj.year}年#{obj.month}月</p>
                                <div class="m-dp-day">
                                    <div>日</div>
                                    <div>一</div>
                                    <div>二</div>
                                    <div>三</div>
                                    <div>四</div>
                                    <div>五</div>
                                    <div>六</div>
                                </div>
                                <div class="m-dp-d"></div>
                            </section>
                        """)
                    $mCtn.append($mDom)
                    $dCtn = $mDom.find('.m-dp-d')
                    for dateInfo, i in obj.dateObj
                        cls = []
                        clsStr = ''
                        if dateInfo.isUsable
                            cls.push('usable')
                        if dateInfo.isHighLight
                            cls.push('highLight')
                        if dateInfo.isSelected
                            cls.push('selected')
                        if dateInfo.isHasPrice
                            cls.push('hasPrice')
                        clsStr = cls.join(' ')
                        if cls.length > 0
                            $dDom = $("""
                                    <span class="#{clsStr}">
                                        #{dateInfo.renderDate}
                                    </span>
                                    """).data('dateInfo', dateInfo)
                            if clsStr.indexOf('hasPrice') isnt -1
                                $priceDom = $("<i>￥#{dateInfo.sellPrice}</i>")
                                $dDom.append($priceDom)
                        else
                            $dDom = $("<span>#{dateInfo.renderDate}</span>").data('dateInfo', dateInfo)
                        $dCtn.append($dDom)
                        cls = null
                return
            renderStaticDom: ->
                title = @settings.title
                staticTpl = """
                            <header class="g-dp-hd">
                                <span class="u-back-btn"></span>
                                #{title}
                            </header>
                            <article class="g-dp-bd"></article>
                            """
                @$dpCtn.empty().append(staticTpl);
                return
            requestData: (callback)=>
                datePickerDataList = Mock.mock(dataTpl).data

                if $.isFunction(callback)
                    callback()
                return
            getDate: (dateObj)->
                newDate = new Date()
                year
                month
                date
                day
                if not dateObj?
                    year = newDate.getFullYear()
                    month = newDate.getMonth() + 1
                    date = newDate.getDate()
                    day = weekDay[newDate.getDay()]
                    return [year, month, date, day]
                if $.isPlainObject(dateObj)
                    addType = dateObj.addType or 'd'
                    dateArr = dateObj.dateArr
                    addNum = dateObj.addNum or 1
                    newDateAdded
                    newDateAddedMs
                    yearAdded
                    monthAdded
                    dateAdded
                    dayAdded
                    year = dateArr[0]
                    month = dateArr[1] - 1
                    date = dateArr[2]
                    switch addType
                        when 'd'
                            newDateAddedMs = newDate.setDate(date + addNum)
                        when 'm'
                            newDateAddedMs = newDate.setMonth(month + addNum)
                        when 'y'
                            newDateAddedMs = newDate.setFullYear(year + addNum)
                        else
                            break
                    newDateAdded = new Date(newDateAddedMs)
                    dateAdded = newDateAdded.getDate()
                    monthAdded = newDateAdded.getMonth() + 1
                    yearAdded = newDateAdded.getFullYear()
                    dayAdded = newDateAdded.getDay()
                    return [yearAdded, monthAdded, dateAdded, dayAdded]
            getBeginDate: ->
                @getDate()
            getEndDate: ->
                @getDate({
                    dateArr: beginDateArr
                    addNum: 90
                })
            getRenderEndDate: ->
                @getDate({
                    dateArr: beginDateArr
                    addType: 'y'
                })
            factoryDateData: ->
                eachYear = beginDateArr[0]
                eachMonth = beginDateArr[1]
                eachDate = beginDateArr[2]
                d = new Date()
                startIndex
                isToday = 0
                renderDateCount
                renderDate
                eachMonthLastDateIndex
                isHasPrice
                isHighLight
                isSelected
                isUsable = false
                isTomorrow

                dpDataList = datePickerDataList.concat()
                for i in [0..renderMonthCount]
                    if eachMonth > 12
                        eachMonth = 1
                        eachYear++

                    @dateArray[i] =
                        year: eachYear
                        month: eachMonth

                    d.setDate(1)
                    d.setMonth(eachMonth - 1)
                    d.setFullYear(eachYear)
                    @dateArray[i].dateObj = []

                    startIndex = @getDateIndex(eachYear, eachMonth - 1, 1)
                    renderDateCount = startIndex + @getDaysInMonth(eachYear, eachMonth)
                    for j in [0..(renderDateCount - 1)]
                        isHighLight = false
                        isSelected = false
                        if j < startIndex
                            @dateArray[i].dateObj[j] = {
                                isUsable: isUsable
                                renderDate: ''
                                date: ''
                            }
                        else
                            numDate = d.getDate()
                            renderDate = d.getDate()
                            renderDay = d.getDay()
                            if eachYear is beginDateArr[0] and eachMonth is beginDateArr[1] and renderDate is beginDateArr[2]
                                isToday = 1
                                isUsable = true
                                isHasPrice = true
                                t = 0

                            if renderDay is 0 or renderDay is 6
                                isHighLight = true

                            if isHasPrice
                                sellPrice = dpDataList[t].sellPrice
                                if dpDataList[t + 1]?
                                    t++
                                else
                                    isHasPrice = false
                                    sellPrice = ''

                            switch isToday
                                when 1
                                    renderDate = '今天'
                                    isToday++
                                    isHighLight = true
                                when 2
                                    renderDate = '明天'
                                    isToday++
                                    isHighLight = isSelected = true
                                    isTomorrow = true
                                when 3
                                    renderDate = '后天'
                                    isToday++
                                    isHighLight = true
                                else
                                    break
                            that = @
                            @dateArray[i].dateObj[j] = {
                                isUsable: isUsable
                                renderDate: renderDate
                                isHasPrice: isHasPrice
                                sellPrice: sellPrice
                                date: [eachYear, eachMonth, d.getDate(), d.getDay(), weekDay[d.getDay()]]
                                isHighLight: isHighLight
                                isSelected: isSelected
                                formatDate: that.formatDate([eachYear, eachMonth, numDate])
                            }
                            if isTomorrow
                                 initDateObj = @dateArray[i].dateObj[j]
                                 isTomorrow = false
                            d.setDate(d.getDate() + 1)

                    eachMonth++
                    eachMonthLastDateIndex = @getDateIndex(eachYear, eachMonth - 1, 0)
                    if eachMonthLastDateIndex is 6
                        continue
                    for k in [0..6 - eachMonthLastDateIndex - 1]
                        @dateArray[i].dateObj[j + k] = {
                            isUsable: false
                            renderDate: ''
                            date: ''
                        }
                return
            getDateIndex: (y, m, date)->
                new Date(y, m, date).getDay()
            getDaysInMonth: (year, month) ->
                if month is 2 and ((year % 4 is 0 and year % 100 is 0) or (year % 400 is 0))
                    return 28
                else
                    monthDay[month]
            show: ->
                @$dpCtn.show()
                return
            hide: ->
                @$dpCtn.hide()
                return
        new Plugin(@, options)
        return @
    return