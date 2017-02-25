##jquery.slidePage.js
滑块滑动插件，自己封装的第一个jquery插件，参考了一些前人的经验
###用法
#####DOM树结构
```HTML
<div class="slide-page">
	<div class="slide-page-item"></div>
	<div class="slide-page-item"></div>
	<div class="slide-page-item"></div>
	...
</div>
```
将每页的内容放入类名为`.slide-page-item`的div中即可<br>
需要引入css文件`<link rel="stylesheet" href="slidePage.css" />`<br>
#####初始化
```JavaScript
var slider = $(".slide-page").slidePage();
```
#####带参数的初始化
```JavaScript
var slider = $(".slide-page").slidePage({
    orientation: 'vertical',   //滑块方向，可选值为'vertical'和'horizontal'，默认值为'vertical'
    keyboard: true,            //是否开启键盘监听，默认开启
    duration: 1000,            //动画持续时间，单位毫秒
    quietPeriod: 300,          //停滞时间，单位毫秒
    menu: null                //滑动点的名称，是一个数组，根据滑块的多少而定
);
```
#####滑块滑动时执行事件
```JavaScript
slider.on('slide', function(){
	//自定义事件
});
```