<?php
/**
 * Created by PhpStorm.
 * User: 13755
 * Date: 2018/5/24
 * Time: 16:37
 */

namespace app\wxrunapi\controller;
use think\Controller;
use think\Db;
use think\Request;

class Run extends Controller
{
    public function index()
    {
        return json(['code'=>0,'msg'=>'接口测试正常','data'=>null]);
    }
    public function  getall()//获取跑步排行榜成功
    {
      $data = Db::table("running_run")
          ->alias('run')
          ->join('running_user user','run.who=user.id')
          ->field("user.avatarUrl,user.nickName,run.who,count(run.who) as count,sum(runtime) as sumRunTime,sum(kilometer) as sumMeters")
          ->order("sum(kilometer) desc")
          ->group("who")
          ->select();
        return json(['code'=>1,'msg'=>'获取跑步排行榜成功！','data'=>$data]);
    }
    public function  getwho()//获取单个人的跑步记录
    {
        $request = Request::instance();
        if($request->has("userid","post")) {
            $data = Db::table("running_run")->where("who", "=", $request->post("userid"))->order("time desc")->select();
            for ($i = 0; $i < count($data); $i++) {
                $data[$i]['time'] = date('Y-m-d H:i', $data[$i]['time']);
            }
            return json(['code' => 1, 'msg' => '获取他的跑步记录成功！', 'data' => $data]);
        }
        return json(['code' => 0, 'msg' => '缺少参数！', 'data' => null]);
    }
    public function  save()//保存本次跑步记录
    {
        $request = Request::instance();
        if($request->has("userid","post") && $request->has("runtime","post") && $request->has("kilometer","post")){
            $arr['who'] = $request->post("userid");
            $arr['runtime'] = $request->post("runtime");
            $arr['time'] = time();
            $arr['kilometer'] = $request->post("kilometer");
            $re = Db::table("running_run")->insert($arr);
            if ($re){
                return json(['code'=>1,'msg'=>'保存本次跑步记录成功！','data'=>null]);
            }else{
                return json(['code'=>0,'msg'=>'保存本次跑步记录失败！','data'=>null]);
            }
        }else{
            return json(['code'=>0,'msg'=>'没有携带跑步数据！','data'=>null]);
        }
    }
}