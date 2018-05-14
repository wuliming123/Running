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
            exit(json_encode(['code'=>0,'msg'=>'请通过登录后在操作','data'=>null]));
        }
    }
    public function index()
    {
        return json(['code'=>0,'msg'=>'接口测试正常','data'=>null]);
    }
    public function uphead()//上传头像接口
    {
        try{
            $request = Request::instance();
            if($file = $request->file('file')) {
                $data['id'] = $request->post("id");
                //$file = request()->file('file');
                $info = $file->validate(['size' => 5242880, 'ext' => 'jpg,png,gif,bmp'])->move(ROOT_PATH . 'public' . DS . 'uploads');
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
    public function modifymyinfo()//修改我的资料
    {
        $request = Request::instance();
        $myinfo =  json_decode($request->post("myinfo"),true);
        unset($myinfo['yiguanzhu']);
        unset($myinfo['xianghuguanzhu']);
        if (Db::name("user")->where("id",$request->post("id"))->update($myinfo))
        {
          return json(['code'=>1,'msg'=>'修改资料成功','data'=>null]);
        } else{
            return json(['code'=>0,'msg'=>'修改资料失败','data'=>null]);
        }
    }
    public function getuserinfo()//获取一个用户的某些信息，id，昵称，头像地址，电话，性别，出生日期，学校，地址，我是否关注了它，是否为相互关注
    {
        $request = Request::instance();
        //查询自己被哪些人关注 结果是数组
        $arr_befollowed = explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("id"))->select()[0]['beFollowed']);
        $arr_befollowed=array_filter($arr_befollowed);
        //查询自己关注哪些人 结果是数组
        $arr_followed = explode(",", Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->select()[0]['followed']);
        $arr_followed=array_filter($arr_followed);
        $data = Db::name("user")->field('id,nickName,avatarUrl,phone,gender,dateOfBirth,school,address')->where("id",$request->post("userid"))->select()['0'];
        if($data){
            if (in_array($request->post("userid"),$arr_followed )){
                $data['yiguanzhu'] = true;
            }else{
                $data['yiguanzhu'] = false;
            }
            if (in_array($request->post("userid"),$arr_befollowed )){
                $data['xianghuguanzhu'] = true;
            }else{
                $data['xianghuguanzhu'] = false;
            }
            return json(['code'=>1,'msg'=>'获取用户信息成功','data'=>$data]);
        }else
        {
            return json(['code'=>0,'msg'=>'获取用户信息失败','data'=>null]);
        }
    }
    public function getguanzhu()//查询某个人关注的人的id，头像，昵称，性别
    {
        try{
            $request = Request::instance();
            //查询自己被哪些人关注 结果是数组
            $arr_befollowed = explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("id"))->select()[0]['beFollowed']);
            $arr_befollowed=array_filter($arr_befollowed);//清除空元素
            //查询用户id为userid的人的关注了哪些人，并返回关注的那些人的id，昵称，头像地址，性别
            $data = Db::name('user')
                ->field("id,nickName,avatarUrl,gender")
                ->where('id','IN',
                    Db::name("followed")
                        ->field('id,followed')
                        ->where("id",$request->post("userid"))
                        ->select()[0]['followed']
                )
//		        ->where("id","<>",$request->post("id"))
                ->select();
            return json(['code'=>1,'msg'=>'获取用户信息成功','data'=>$data]);
        }catch (Exception $e){
            return json(['code'=>0,'msg'=>'获取用户信息失败','data'=>[]]);
        }

    }
    public function getfensi()//查询某个
        //人的粉丝列表id，昵称，头像，性别
    {
        try{
            $request = Request::instance();
            //查询userid被哪些人关注 结果是数组
            $arr_befollowed = explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("userid"))->select()[0]['beFollowed']);
            $arr_befollowed=array_filter($arr_befollowed);//清除数组中的空元素
            //查询用户userid的粉丝列表，有粉丝们的id，昵称，头像地址，性别
            $data = Db::name('user')
                ->field("id,nickName,avatarUrl,gender")
                ->where('id','IN', $arr_befollowed)
//		        ->where('id','<>', $request->post("id"))
                ->select();
            return json(['code'=>1,'msg'=>'获取粉丝列表成功','data'=>$data]);
        }catch (Exception $e){
            return json(['code'=>0,'msg'=>'获取粉丝列表失败','data'=>[]]);
        }

    }
    public function delaguanzhu()//取消关注某个人
    {
        $request = Request::instance();
        //查询自己关注哪些人 结果是数组
        $arr_followed = explode(",", Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->select()[0]['followed']);
        $arr_followed=array_filter($arr_followed);
        if(in_array($request->post('userid'),$arr_followed)){
            $arr_followed = array_merge(array_diff($arr_followed, array($request->post('userid'))));//把我的关注里删除了它
            $str = implode(",", $arr_followed);//重组数据
            //把对方被关注里的数据把自己删了
            $arr_he_befollowed =explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("userid"))->select()[0]['beFollowed']);
            $arr_he_befollowed=array_filter($arr_he_befollowed);
            $arr_he_befollowed = array_merge(array_diff($arr_he_befollowed, array($request->post('id'))));//把我的关注里删除了它
            $str2 = implode(",", $arr_he_befollowed);//重组数据
            if (Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->update(["followed"=>$str.','])){
                Db::name("followed")->field("id,beFollowed")->where("id",$request->post("userid"))->update(["beFollowed"=>$str2.',']);
                return json(['code'=>1,'msg'=>'取消关注成功','data'=>null]);
            }
            else
                return json(['code'=>0,'msg'=>'取消关注失败','data'=>null]);
        }else{
            return json(['code'=>0,'msg'=>'你没有关注此用户，不需要取消关注','data'=>null]);
        }

    }
    public function addaguanzhu()//添加关注某个人
    {
        $request = Request::instance();
        //查询自己关注哪些人 结果是数组
        $arr_followed = explode(",", Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->select()[0]['followed']);
        $arr_followed=array_filter($arr_followed);
        if(!in_array($request->post('userid'),$arr_followed)){
            array_push($arr_followed,$request->post('userid'));
            $str = implode(",", $arr_followed);//重组数据
            //在对方被关注里的增加自己进去
            $arr_he_befollowed =explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("userid"))->select()[0]['beFollowed']);
            $arr_he_befollowed=array_filter($arr_he_befollowed);
            array_push($arr_he_befollowed,$request->post('id'));
            $str2 = implode(",", $arr_he_befollowed);//重组数据
            if (Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->update(["followed"=>$str.','])){
                Db::name("followed")->field("id,beFollowed")->where("id",$request->post("userid"))->update(["beFollowed"=>$str2.',']);
                return json(['code'=>1,'msg'=>'关注成功','data'=>null]);
            }
            else
                return json(['code'=>0,'msg'=>'关注失败','data'=>null]);
        }else{
            return json(['code'=>0,'msg'=>'你已经关注了该用户','data'=>null]);
        }
    }
    public function showmyplan()//获取自己发布的所有帖子、每个帖子的评论数（父评论和子评论）、每个帖子的点赞数
    {
        $request = Request::instance();
        $fpl = Db::table("running_answer")->alias("answer")
            ->join("running_plan plan","plan.planId = answer.planId")
            ->where("plan.id",$request->post("id"))
            ->field('plan.planId')
            ->select();
        $zpl = Db::table("running_plan")->alias("plan")
            ->where("plan.id",$request->post("id"))
            ->join("running_answer answer","plan.planId = answer.planId")
            ->join("running_reply reply","reply.answerId = answer.answerId")
            ->field('plan.planId')
            ->select();
        //查询我发布的plan
        if($data = Db::name("plan")->field('planId,content,date,goodFans,id')->where("id",$request->post('id'))->select()){
            for($i=0;$i<count($data);$i++){
                $arr_befollowed = explode(",", $data[$i]['goodFans']);
                $arr_befollowed=array_filter($arr_befollowed);
                $data[$i]['zanNum']= count($arr_befollowed);
                $data[$i]['date']=date("Y-m-d H:i",$data[$i]['date']);
                unset($data[$i]['goodFans']);
                for($j= 0,$data[$i]['pingNum']=0 ; $j<count($fpl);$j++){
                    if ($data[$i]['planId']==$fpl[$j]['planId'])
                        $data[$i]['pingNum']++;
                }
                for ($j = 0;$j<count($zpl);$j++){
                    if ($data[$i]['planId']==$zpl[$j]['planId'])
                        $data[$i]['pingNum']++;
                }
            }
        }
        return json(['code'=>1,'msg'=>'获取列表成功','data'=>$data]);
    }
    public function delplan()//删除一条plan，mysql用来触发器，会自动删除其评论(父子都会删除)
    {
        $request = Request::instance();
        if(Db::name("plan")->where('planId',$request->post('planId'))->delete()){
            return json(['code'=>1,'msg'=>'删除成功','data'=>null]);
        }else{
            return json(['code'=>0,'msg'=>'删除失败','data'=>null]);
        }
    }
    public function numaboutme()//统计与我相相关页有多少条与我相关的内容。
    {
        $request = Request::instance();
        //统计我发的计划中有的新评论
        $data = Db::table("running_answer")->alias("answer")
            ->join("running_plan plan",'plan.planId = answer.planId')
            ->field("answer.planId,answer.readFlag,plan.planId,plan.id")
            ->where('answer.readFlag',1)
            ->where("plan.id",$request->post("id"))
            ->select();
        //统计我发的评论中有的新回复
        $data1=Db::table("running_reply")
            ->field("readFlag,replyUserId")
            ->where("replyUserId",$request->post("id"))
            ->where("readFlag",1)->select();
        //看我发发布的计划中有没有新人点赞，当有人点赞会给该计划加一个有人点赞的标记
        $data2 = Db::table("running_plan")
            ->field("id,readFlag,goodFans")
            ->where('readFlag',1)
            ->where("id",$request->post("id"))
            ->select();
        $num=count($data)+count($data1)+count($data2);
        return json(['code'=>1,'msg'=>'成功统计','data'=>['pl'=>count($data),'hf'=>count($data1),'zan'=>count($data2),'sum'=>$num>=99?99:$num]]);
    }
    public function zanaboutme()//查看哪些人赞了我的计划
    {
        $request = Request::instance();
        //查询所有计划有新点赞的标记然后查询是哪些人点了赞
        $data = Db::table("running_plan")->alias("plan")
            ->field("id,readFlag,goodFans,content,planId")
            ->where('plan.readFlag',1)
            ->where("plan.id",$request->post("id"))
            ->select();
        $arr=[];
        $str = '';
        //把所有计划中的所有点赞的人的id取出来
        for ($i=0;$i<count($data);$i++){
            $temp=explode(",",$data[$i]['goodFans']);
            $arr=array_merge($arr,$temp);
            $str.=$data[$i]['planId'].',';
        }
        //把点赞标记还原
        Db::table("running_plan")->where("planId","IN",explode(",",$str))->update(["readFlag"=>0]);
        $arr =array_filter(array_unique($arr));
        //通过你所有计划中的所有点赞的人的id找到他对应的昵称
        $data1=Db::table("running_user")->field("id,nickName")->where("id","IN",$arr)->select();
        //重组所有计划中的点赞的人  id+昵称
        for ($i=0;$i<count($data);$i++){
            $temp=explode(",",$data[$i]['goodFans']);
            $temp=array_filter($temp);
            $data[$i]['dianzan']=[];
            for($j =0 ;$j<count($temp);$j++){
                for ($x=0;$x<count($data1);$x++){
                    if($temp[$j]==$data1[$x]['id']){
                        $data[$i]['dianzan']=array_merge($data[$i]['dianzan'],[$data1[$x]]);
                    }
                }
            }

        }
        return json(['code'=>1,'msg'=>'获取点赞信息成功','data'=>$data]);
    }
    public function plaboutme()//我的计划新增评论
    {
        $request = Request::instance();
        //统计我发的计划中有的新评论
        $data = Db::table("running_answer")->alias("answer")
            ->join("running_user pluser",'pluser.id=answer.id')
            ->join("running_plan plan",'plan.planId = answer.planId')
            ->join("running_user user",'user.id=plan.id')
            ->where('answer.readFlag',1)
            ->where("plan.id",$request->post("id"))
            ->order("answer.date desc")
            ->field("plan.planId as ztId,plan.content as  ztContent,plan.id as ztAuthorId,user.nickName as ztAuthorName,answer.id as plAuthorId,pluser.nickName as plAuthorName,answer.date as plTime,answer.answerId as plId,answer.content as plContent")
            ->select();
        //把新评变成久评论//统计我发的计划中有的新评论
        Db::table("running_answer")
            ->where("planId","IN",
                array_column(Db::table("running_plan")->where("id",$request->post("id"))->field("planId")->select(), 'planId')
            )
            ->where('readFlag',1)
            ->update(['readFlag'=>0]);
        return json($data);
    }
    public function hfaboutme()//我的评论新回复
    {
        $request = Request::instance();
        //统计我发的评论中有的新回复
        $data=Db::table("running_reply")->alias("reply")
            ->join("running_answer answer","answer.answerId = reply.answerId")
            ->join("running_plan plan","plan.planId = answer.planId")
            ->join("running_user zhuti","zhuti.id=plan.id")
            ->join("running_user cengzhu","cengzhu.id=answer.id")
            ->join("running_user from","from.id=reply.id")
            ->join("running_user to","to.id=reply.replyUserId")
            ->where("reply.replyUserId",$request->post("id"))
            ->where("reply.readFlag",1)
            ->field("
                plan.content as zhutiContent,
                plan.planId as zhutiPlanId,
                plan.id as zhutiAuthorId,
                zhuti.nickName as zhutiAuthorName,
                answer.id as cengzhuId,
                cengzhu.nickName as cengzhuName,
                answer.content as cengzhuContent,
                answer.date as cengzhuTime,
                from.nickName as fromName,
                reply.id as fromId,
                reply.date as fromTime,
                reply.content as fromContent,
                to.nickName as toName,
                reply.replyUserId as toId
            ")
            ->order("reply.date desc")
            ->select();
        //清除我被回复标记
        Db::table("running_reply")
            ->field("readFlag,replyUserId")
            ->where("replyUserId",$request->post("id"))
            ->where("readFlag",1)
            ->update(['readFlag'=>0]);
        return json($data);
    }
    public function showhisplan()//获取某个人发布的所有帖子、每个帖子的评论数（父评论和子评论）、每个帖子的点赞数
    {
        $request = Request::instance();
        $fpl = Db::table("running_answer")->alias("answer")
            ->join("running_plan plan","plan.planId = answer.planId")
            ->where("plan.id",$request->post("userid"))
            ->field('plan.planId')
            ->select();
        $zpl = Db::table("running_plan")->alias("plan")
            ->where("plan.id",$request->post("userid"))
            ->join("running_answer answer","plan.planId = answer.planId")
            ->join("running_reply reply","reply.answerId = answer.answerId")
            ->field('plan.planId')
            ->select();
        if($data = Db::name("plan")->field('planId,content,date,goodFans,id')->where("id",$request->post('userid'))->select()){
            for($i=0;$i<count($data);$i++){
                $arr_befollowed = explode(",", $data[$i]['goodFans']);
                $arr_befollowed=array_filter($arr_befollowed);
                $data[$i]['zanNum']= count($arr_befollowed);
                $data[$i]['date']=date("Y-m-d H:i",$data[$i]['date']);
                unset($data[$i]['goodFans']);
                for($j= 0,$data[$i]['pingNum']=0 ; $j<count($fpl);$j++){
                    if ($data[$i]['planId']==$fpl[$j]['planId'])
                        $data[$i]['pingNum']++;
                }
                for ($j = 0;$j<count($zpl);$j++){
                    if ($data[$i]['planId']==$zpl[$j]['planId'])
                        $data[$i]['pingNum']++;
                }
            }
        }
        return json(['code'=>1,'msg'=>'获取列表成功','data'=>$data]);
    }
}