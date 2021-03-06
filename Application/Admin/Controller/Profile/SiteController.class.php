<?php
namespace Admin\Controller\Profile;

/**
 * 后台配置控制器
 */
class SiteController extends \Admin\Controller\ProfileController {

    /**
     * 我的站点列表
     */
    public function mysite(){
        $uid        =  UID;
        $list       =   M("Site")->where("manage=$uid")->order('id asc')->select();
        int_to_string($list,array(
                'status'=>array(
                    0=>"<span class='badge badge-danger'>关闭</span>",
                    1=>"<span class='badge badge-success'>开启</span>"
                )
            )
        );
    
        $this->assign('list',$list);
        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);

        $this->meta_title = '我的站点';
        $this->display('Profile/Site/mysite');
    }
    
    /**
     * 站点内容管理
     */
    public function manage(){
        $id = I('get.id');


        $session_id = session('site_id');

        if(empty($id)){
            $id = session("site_id");
            if( empty($id) ){
                $this->error('没有选择要操作站点',U("Profile/site"));
            }
        }else{
            session("site_id",$id);

            // 信息的获取在_initialize方法中进行，先于session的更改，故此要重新获取
            $this->_getSiteInfo($id);   
        }

        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);
        $this->meta_title = '管理站点';

        $this->display('Profile/Site/manage');
    }

    /**
     * 设置站点状态
     */
    public function set(){
        $status = I('status');
        $id = array_unique((array)I('id',0));

        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        if ( !in_array($status,array(0,1)) ) {
            $this->error('参数错误!');
        }

        $map = array('id' => array('in', $id) );
        if(M('Site')->where($map)->setField("status",$status)){
            $this->success('操作成功');
        } else {
            $this->error('操作失败！');
        }
    }
    
    /**
     * 基础信息管理
     */
    public function editsite(){
        $Site = D('Site');
        $data = $Site->create();
        if($data){
            $res = $Site->save();
            if($res){
                $this->success("站点信息保存成功");
            }else{
                $this->error("站点信息保存失败");
            }
        } else {
            $this->error("站点信息保存失败");
        }
    }
    
    /**
     * 基础信息管理
     */
    public function config(){
        if(IS_POST){
            $data = array();

            $data['id'] = I('id');

            $config = I('config');
            $data['config'] = json_encode($config);

            $Site = D('Site');
            $data = $Site->create($data);
            if($data){
                $res = $Site->save();
                if($res){
                    $this->success("站点信息保存成功");
                }else{
                    $this->error("站点信息保存失败");
                }
            } else {
                $this->error("站点信息保存失败");
            }

        }else{
            $this->display("Profile/Site/config"); 
        }
        
    }


}