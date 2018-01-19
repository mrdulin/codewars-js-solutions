# input元素全选文本

|测试机型|系统版本|测试环境|方法|结果|
|---|---|---|---|---|
|小米4|Android 6.0.1|系统自带浏览器 - WebView in com.android.browser (53.0.2785.146)|setSelectionRange|×|
||||select|√|
|||微信6.6.1|setSelectionRange|√|
||||select|√|
|||Chrome (55.0.2883.91)|setSelectionRange|√|
||||select|√|
|iPhone8P|11.2.1|微信6.6.1|setSelectionRange|√|
||||select|×|
|||Safari|setSelectionRange|√|
||||select|×|