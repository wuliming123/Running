<?php
namespace app\wxrunapi\controller;

use think\Controller;
use think\Db;
use think\Request;

class Home extends Controller
{
     public function _initialize()
     {
         $request = Request::instance();
         if($request->action()!="showplan" && $request->action()!="showmessage" &&  $request->action()!="showcomment") {
             if ($request->has("id", "post") && $request->has("token", "post")) {
                 $data['token'] = $request->post('token');
                 $data['id'] = $request->post('id');
                 if (!Db::name("user")->where($data)->select()) {
                     exit(json_encode(['code' => 0, 'msg' => '登录状态已过期，请重新登录' . $data, 'data' => null]));
                 }
             } else {
                 exit(json_encode(['code' => 0, 'msg' => '请通过登录后在操作', 'data' => null]));
             }
         }
     }

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

        //查询首页的所有动态
        $data = Db::table("running_user")->alias("user")
            ->join("running_plan plan",'user.id = plan.id')
            ->field('user.id,planId,nickName,avatarUrl,gender,school,content,contentPic,planAddress,date')
            ->order('date desc')
            ->select();
        // 一坨狗屎代码 查询首页的评论数
        $fpl = Db::name("answer")->select();
        $zpl = Db::table("running_answer")->alias("answer")
            ->join("running_reply reply","answer.answerId = reply.answerId")        
            ->select();
        if($data){
            for($i = 0;$i < count($data);$i++){
                // 时间格式化
                $data[$i]['time'] = date("H:i",$data[$i]['date']);
                $data[$i]['date'] = date("m-d",$data[$i]['date']);
                $data[$i]["indexPic"] = explode(",",substr($data[$i]['contentPic'],0,-1));
                $data[$i]['showPic'] = 3;
                // 三循环，我去
                $data[$i]['commentNumber'] = 0;
                for($j = 0;$j < count($fpl);$j++){
                    if($data[$i]['planId'] == $fpl[$j]['planId']){
                        $data[$i]['commentNumber']++;
                        for($k = 0;$k < count($zpl);$k++){
                            if($fpl[$j]['answerId'] == $zpl[$k]['answerId']){
                                $data[$i]['commentNumber']++;
                            }
                        }
                    }
                }
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
        Db::name("plan")->where("planId",$request->post("planId"))->update(['readFlag'=>1]);//被点赞或则取消赞，通知用户
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

    //动态页内容展示
    public function showMessage()
    {
        $request = Request::instance();
        $planId = $request->post("planId");
        //主题相关内容
        $data = Db::table("running_user")->alias("user")
            ->join("running_plan plan","user.id = plan.id")
            ->where("planId",$planId)
            ->field('user.id,planId,nickName,avatarUrl,gender,school,content,contentPic,planAddress,date,goodFans')
            ->select()[0];
        $data['time'] = date("H:i",$data['date']);
        $data['date'] = date("m-d",$data['date']);
        $data["indexPic"] = explode(",",substr($data['contentPic'],0,-1));
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

    //动态页评论展示
    public function showComment()
    {
        $request = Request::instance();
        $planId = $request->post("planId");
        //父评论
        $data = Db::table("running_answer")->alias("answer")
            ->join("running_user user","user.id = answer.id")
            ->where("planId",$planId)
            ->field('nickName,answerId,avatarUrl,school,answer.id,answer.content,answer.date')
            ->order("answer.date desc")
            ->select();
        //查询子评论
        if($data){
            $sonData = Db::table("running_reply")->alias("reply")
                ->join("running_answer answer","answer.answerId = reply.answerId")
                ->join("running_user pinlunren","reply.id = pinlunren.id")
                ->join("running_user hf","reply.replyUserId = hf.id")
                ->where("planId",$planId)
                ->field('pinlunren.nickName as pinlunren,hf.nickName as hf,reply.*')
                ->select();
            for($i=0;$i<count($data);$i++)
                for($j=0;$j<count($sonData);$j++){
                    if($data[$i]['answerId'] == $sonData[$j]['answerId']){
                        $data[$i]["zpl"][] = $sonData[$j];
                }
            };
        }
        if($data){
            return json(['code'=>1,'msg'=>'接口测试正常','data'=>$data]);
        }else{
            return json(['code'=>1,'msg'=>'接口测试异常','data'=>null]);
        }
    }

    public function deleteComment()
    {
        $request = Request::instance();
        $answerId = $request->post('answerId');
        if($answerId){
            $result = Db::name('answer')->where('answerId',$answerId)->delete();
            if($result){
                return json(['code'=>1,'msg'=>'接口测试正常','data'=>$result]);
            }else{
                return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
            }
        }else{
            return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
        }
    }

    //发布评论
    public function answer()
    {
        $request = Request::instance();
        $data['id'] = $request->post("id");
        $data["planId"] = $request->post("planId");
        $data["content"] = $request->post("content");
        $data["date"] = time();
        if($data["id"] && $data["planId"]){
            $result = Db::name("answer")->insert($data);
            if($result){
                return json(['code' => 1,'msg' => "接口测试正常",'data'=>null]);
            }else{
                return json(['code'=>0,'msg'=>'回复失败','data'=>null]);
            }
        }else{
            return json(['code'=>0,'msg'=>'接口测试异常','data'=>null]);
        }
    }

    //发布子评论
    public function reply()
    {
        $request = Request::instance();
        $data['id'] = $request->post("id");//回复人Id
        $data['replyUserId'] = $request->post("replyUserId");//回复目标Id
        $data['answerId'] = $request->post("answerId");
        $data['content'] = $request->post("content");
        $data['date'] = time();
        if($data["id"] && $data["answerId"]){
            $result = Db::name("reply")->insert($data);
            if($result){
                return json(['code' => 1,'msg' => "接口测试正常",'data'=>null]);
            }else{
                return json(['code'=>0,'msg'=>'回复失败','data'=>null]);
            }
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