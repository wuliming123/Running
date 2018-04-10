Running —— 同城约跑平台
======================

* 1、这个项目是一个微信小程序,API部分是用ThinkPHP5写的;
* 2、本作品是用来参赛的，目前还在开发中，中途会不定时的提交代码,数据库部分当项目结束后提交;
* 3、本程序不允许做商业用途，转载请标明出处;<br>

# 使用注意

## 使用本程序需要更改的部分:

* 数据库：`\server\application\wxrunapi\database.php`->`hostname`、`database`、`username`、`password`
* 小程序AppID和AppSecret：`\server\application\wxrunapi\controller\Login.php`->方法`getOpenid`和`getUserInfo`
* 把server目录部署到服务器(数据库部分当项目结束后提交)
* 小程序前台调用接口部分：`\client\utils\api.js`->`const Host = 'http://localhost/wxrunapi/';`

# 参与者

* 吴黎明
    * [个人网页](http://itliming.cn/);
    * [github](https://github.com/wuliming123);<br>
* 余鸿静
    * [个人网页](http://yuhongjing.cn/);
    * [github](https://github.com/yuhongjing);<br>
* 徐敏
    * [个人网页](http://future-dream-xm.com/);
    * [github](https://github.com/xm-428);<br>
