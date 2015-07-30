<?php
namespace Admin\Controller\Profile;

/**
 * 后台配置控制器
 */
class SiteController extends \Admin\Controller\AdminController {

    public $profile_info = array(
        '-2' =>"数据保存失败",
        '-1' =>"没有选择要操作站点",
        '0' =>"所选栏目没有改变",
    );


    /**************************
     * Profile site method    *  
     **************************/
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

        if(empty($id)){
            $this->error("请选择要管理的站点！");
        }

        $status = array(0=>'关闭',1=>'开启');
        $site_info = M("Site")->find($id);
        $site_info['status_text'] = $status[$site_info['status']];
        if( !$site_info ){
            $this->error("站点不存在！");
        }
        if( $site_info['manage'] != UID ){
            $this->error("您无权管理他人站点！");
        }

        $cate_list     =   D('Category')->where("site_id = $id")->getTree();

        $this->assign('cate_list',     $cate_list);
        $this->assign("info",$site_info);
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
            return $Site->save();
        } else {
            return -2;
        }
    }

    /**
     * 给站点添加分类
     */
    public function category(){
        $cid = I("cid");
        $site_id = I("site_id");

        if( empty($site_id) ){
            return -1;
        }

        $cid = implode(',',$cid);

        $res = M("Site")->where("id = $site_id ")->setField('category',$cid);

        return $res;
    }


}