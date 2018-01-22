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

**问题**：使用`input[type='number']`表单控件，当用户点击该表单控件时，设置光标的位置到文本值的尾端。

在PC端`Chrome 63.0.3239.132`下会报: `Uncaught InvalidStateError: Failed to execute 'setSelectionRange' on 'HTMLInputElement': The input element's type ('number') does not support selection.`错误，并且设置光标位置无效。

小米4，设置光标位置也没有效果

但在iPhone8P ios 11.2.1，Safari中，设置光标的位置到输入框尾端是有效果的。

`fastclick`也有这个问题。

**解决方案**: 如果要使用`setSelectionRange`这API，那么应该使用`input[type='text']`等支持此API的表单输入控件，对输入值进行约束和校验。

参考链接：

https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/setSelectionRange
https://github.com/ftlabs/fastclick/issues/358