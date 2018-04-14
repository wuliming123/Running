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
    public function getuserinfo()//获取一个用户的某些信息，id，昵称，头像地址，电话，性别，出生日期，学校，qq，微信号，地址，我是否关注了它，是否为相互关注
    {
        $request = Request::instance();
        //查询自己被哪些人关注 结果是数组
        $arr_befollowed = explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("id"))->select()[0]['beFollowed']);
        $arr_befollowed=array_filter($arr_befollowed);
        //查询自己关注哪些人 结果是数组
        $arr_followed = explode(",", Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->select()[0]['followed']);
        $arr_followed=array_filter($arr_followed);
        $data = Db::name("user")->field('id,nickName,avatarUrl,phone,gender,dateOfBirth,school,qq,wx,address')->where("id",$request->post("userid"))->select()['0'];
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
    public function getguanzhu()//查询某个人关注的人的资料，头像，昵称，性别，是否关注了我
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
                ->select();
            //判断用户id为userid关注的人中，是否有和我相互关注的
            for ($i=0;$i<count($data);$i++){
                if (in_array($data[$i]["id"],$arr_befollowed )){
                    $data[$i]['xianghuguanzhu'] = true;
                }else{
                    $data[$i]['xianghuguanzhu'] = false;
                }
            }
            return json(['code'=>1,'msg'=>'获取用户信息成功','data'=>$data]);
        }catch (Exception $e){
            return json(['code'=>0,'msg'=>'获取用户信息失败','data'=>[]]);
        }

    }
    public function getfensi()//查询某个人的粉丝列表（id，头像，性别）他粉丝是否关注了我
    {
        try{
            $request = Request::instance();
            //查询userid被哪些人关注 结果是数组
            $arr_befollowed = explode(",", Db::name("followed")->field("id,beFollowed")->where("id",$request->post("userid"))->select()[0]['beFollowed']);
            $arr_befollowed=array_filter($arr_befollowed);//清除空值
            //查询用户userid的粉丝列表，有粉丝们的id，昵称，头像地址，性别
            $data = Db::name('user')
                ->field("id,nickName,avatarUrl,gender")
                ->where('id','IN', $arr_befollowed)
                ->select();
            //查询自己的关注
            $arr_followed = explode(",", Db::name("followed")->field("id,followed")->where("id",$request->post("id"))->select()[0]['followed']);
            $arr_followed=array_filter($arr_followed);//清除空值
            //判断用户id为userid关注的人中，是否有和我相互关注的
            for ($i=0;$i<count($data);$i++){
                if (in_array($data[$i]["id"],$arr_followed )){
                    $data[$i]['xianghuguanzhu'] = true;
                }else{
                    $data[$i]['xianghuguanzhu'] = false;
                }
            }
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

}