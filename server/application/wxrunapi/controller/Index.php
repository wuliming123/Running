<?php
namespace app\wxrunapi\controller;

use think\Controller;
use think\Db;
use think\Request;

class Index extends Controller
{
    public function _initialize()
    {
        $request = Request::instance();
        if($request->has("id","post") && $request->has("token","post")){
            $data['token'] = $request->post('token');
            $data['id'] =$request->post('id');
            if(! Db::name("user")->where($data)->select()){
                exit(json_encode(['code'=>0,'msg'=>'登录状态已过期，请重新登录'.$data,'data'=>null]));
            }
        }else{
            exit(json_encode(['code'=>0,'msg'=>'请带上参数请求接口','data'=>null]));
        }
    }
    public function index()
    {
        return json(['code'=>0,'msg'=>'接口测试正常','data'=>null]);
    }
    public function uphead()
    {
        try{
            $request = Request::instance();
            if($file = $request->file('file')) {
                $data['id'] = $request->post("id");
                //$file = request()->file('file');
                $info = $file->validate(['size' => 524288, 'ext' => 'jpg,png,gif,bmp'])->move(ROOT_PATH . 'public' . DS . 'uploads');
                if ($info) {
                    $data['avatarUrl'] = $request->root(true) . "/uploads/" . $info->getSaveName();
                    if (Db::name("user")->update($data))
                        return json(['code'=>1,'msg'=>'上传成功','data'=>$data['avatarUrl']]);
                }
            }
            return json(['code'=>0,'msg'=>'上传失败','data'=>$file]);
        }
        catch(Exception $e)
        {
            return json(['code'=>0,'msg'=>'上传失败'.$e->getMessage(), 'data' => null]); // 上传失败获取错误信息
        }
    }

}