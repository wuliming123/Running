<?php
namespace app\wxrunapi\controller;

use think\Controller;
use think\Db;
use think\Request;

class Home extends Controller
{
    // public function _initialize()
    // {
    //     $request = Request::instance();
    //     if($request->has("id","post") && $request->has("token","post")){
    //         $data['token'] = $request->post('token');
    //         $data['id'] =$request->post('id');
    //         if(! Db::name("user")->where($data)->select()){
    //             exit(json_encode(['code'=>0,'msg'=>'登录状态已过期，请重新登录'.$data,'data'=>null]));
    //         }
    //     }else{
    //         exit(json_encode(['code'=>0,'msg'=>'请通过登录后在操作','data'=>null]));
    //     }
    // }

    public function index()
    {
        return json(['code'=>0,'msg'=>'接口测试正常','data'=>null]);
    }

    //发布一则动态
    public function createPlan()
    {
        $request = Request::instance();
        if($request->post("id") && $request->post("content") && $request->post("planAddress")){
            $info["id"] = $request->post("id");
            $info["content"] = $request->post("content");
            $info["planAddress"] = $request->post("planAddress");
            $info["date"] = time();
            if($planId = Db::name("plan")->insertGetId($info)){
                return json(['code'=>1,'msg'=>'接口测试正常','data'=>$planId]);
            }else{
                return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
            }
        }else{
            return json(['code'=>0,'msg'=>'请携带数据','data'=>null]);
        }
        
        
    }

    //展示主页动态
    public function showPlan()
    {
        // $request = Request::instance();
        //查询首页的所有动态
        $data = Db::table("running_user")->alias("user")
            ->join("running_plan plan",'user.id = plan.id')
            ->field('user.id,planId,nickName,avatarUrl,gender,school,content,contentPic,planAddress,date,commentNumber')
            ->order('date desc')
            ->select();
        if($data){
            for($i = 0;$i < sizeof($data);$i++){
                // 时间格式化
                $data[$i]['time'] = date("H:i",$data[$i]['date']);
                $data[$i]['date'] = date("m-d",$data[$i]['date']);
                $data[$i]["indexPic"] = explode(",",substr($data[$i]['contentPic'],0,-1));
                // //当前用户是否点赞
                // $good = explode(",",$data[$i]["goodFans"]);
                // if(in_array($request->post("id"), $good))
                // {
                //     $data[$i]['status'] = 1;
                // }else{
                //     $data[$i]['status'] = 0;
                // }
                // // 点赞的人数
                // $data[$i]['goodNumber'] = sizeof($good) - 1;
            }
            return json(['code'=>1,'msg'=>'接口测试正常','data'=>$data]);
        }else{
            return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
        }  
    }

    //点赞
    public function goodPlan()
    {
        $request = Request::instance();
        $status = $request->post("status");

        $data = Db::table("running_plan")
            ->where("planId",$request->post("planId"))
            ->field("goodFans")
            ->select()[0]["goodFans"];

        if($status == 1){
            $good = explode(",",$data);
            $index = array_search($request->post("id"),$good); //寻找删除的id的位置
            array_splice($good, $index, 1); //删除自己
            $goodNumber = sizeof($good) - 1;
            $goodFans=implode(",",$good);
            if(Db::name("plan")->where('planId',$request->post("planId"))->update(["goodFans" => $goodFans]))
            {
                $info["status"] = 0;
                $info["goodNumber"] = $goodNumber;
                return json(['code'=>1,'msg'=>'接口测试正常','data'=>$info]);
            }else{
                return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
            }
        }else{
            $good = $data.$request->post("id").",";
            $goodList = explode(",",$good);
            $goodNumber = sizeof($goodList) - 1;
            if(Db::name("plan")->where('planId',$request->post("planId"))->update(["goodFans" => $good]))
            {
                $info["status"] = 1;
                $info["goodNumber"] = $goodNumber;
                return json(['code'=>1,'msg'=>'接口测试正常','data'=>$info]);
            }else{
                return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
            }
        }
    }

    //动态页展示
    public function showMessage()
    {
        $request = Request::instance();
        $planId = $request->post("planId");

        $data = Db::table("running_user")->alias("user")
            ->join("running_plan plan","user.id = plan.id")
            ->where("planId",$planId)
            ->field('user.id,planId,nickName,avatarUrl,gender,school,content,date,commentNumber,goodFans')
            ->select()[0];
        $data['time'] = date("H:i",$data['date']);
        $data['date'] = date("m-d",$data['date']);
        $good = explode(",",$data["goodFans"]);
        if(in_array($request->post("id"), $good))
        {
            $data['status'] = 1;
        }else{
            $data['status'] = 0;
        }
        $data['goodNumber'] = sizeof($good) - 1;
        if($data){
            return json(['code'=>1,'msg'=>'接口测试正常','data'=>$data]);
        }else{
            return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
        }
        
    }

    //上传头像接口
    public function upPic()
    {
        try{
            $request = Request::instance();
            if($file = $request->file('file')) {
                $data['planId'] = $request->post("planId");
                $info = $file->validate(['size' => 5242880, 'ext' => 'jpg,png,gif,bmp'])->move(ROOT_PATH . 'public' . DS . 'uploads');
                if ($info) {
                    $imgPic = $request->root(true) . "/uploads/" . $info->getSaveName();
                    $contentPic = Db::name("plan")->where("planId",$request->post("planId"))->field("contentPic")->select()[0]['contentPic'];
                    $contentPic = $contentPic.$imgPic.",";
                    if (Db::name("plan")->where("planId",$request->post("planId"))->update(['contentPic'=>$contentPic]))
                        return json(['code'=>1,'msg'=>'上传成功','data'=>$contentPic]);
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