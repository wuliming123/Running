<?php
namespace app\wxrunapi\controller;

use think\Controller;
use think\Request;
use think\Db;

class Login extends Controller
{
    private $appid="wxb36bfaeb6099b653";
    private $appSecret = "a68de58c1469396402901fc8621e6fef";
    //登录接口
    public function index()
    {
        $request = Request::instance();//$request中的数据有 code    encryptedData   iv
        if ($request->post('code'))
        {
            $data = $this->getOpenid($request->post('code'));//$data中的数据有session_key    expires_in   openid
            //检查用户第一次登录
            if(!Db::name('user')->where("openid",$data['openid'])->select()){
                $info = json_decode($this->getUserInfo($data['session_key'],$request->post('encryptedData'),$request->post('iv')),true);//把用户资料解密出来
                if($info){
                   $info['address']=$info['province'].$info['city'];
                   unset($info['watermark']);
                   unset($info['province']);
                   unset($info['country']);
                   unset($info['city']);
                   unset($info['language']);
                   Db::name('user')->insert($info);//把用户资料添加进表中
                }
            }
            if (Db::name("user")->where("openid",$data['openid'])->update(["token"=>$data['session_key']])){
                $returns = Db::name('user')->field('id,nickName,token,avatarUrl')->where("openid",$data['openid'])->select()[0];
                return json(['code'=>1,'msg'=>'登录成功','data'=>$returns]);
            }
        }else{
            return json(['code'=>0,'msg'=>'登录失败,没有携带参数','data'=>null]);
        }
    }

    //获取session_key openId
    private function getOpenid($code)
    {
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=".$this->appid."&secret=".$this->appSecret."&js_code=".$code."&grant_type=authorization_code";
        $data = file_get_contents($url);
        $data = json_decode($data,true);
        return $data;
    }

    //通过$session_key $encryptedData ,$vi解密用户信息
    private function getUserInfo($sessionKey,$encryptedData, $iv)
    {
        vendor('wxBizDataCrypt.wxBizDataCrypt');
        $pc = new \WXBizDataCrypt($this->appid, $sessionKey);
        $errCode = $pc->decryptData($encryptedData, $iv, $data );
        if ($errCode == 0) {
            return $data;
        } else {
            return false;
        }
    }

}
