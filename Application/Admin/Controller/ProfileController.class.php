<?php
namespace Admin\Controller;

/**
 * 个人中心
 */
class ProfileController extends AdminController {

    public function index(){
        $this->display();
    }

    public function info(){
        $this->display();
    }

    /**
     * 管理我的站点
     */
    public function site(){
        $a = I('get.smethod',"mysite");

        $Site = new SiteController();
        $res = $Site->$a();

        $return = array('editsite','category');
        if( in_array($a,$return) ){
            
            if( $res == 1 ){
                $info = array(
                    'status'    => 1,
                    'info'      => "操作成功"
                );
            }else{
                $info=array(
                    'status'    => ($res == 1) ? 1 : 0,
                    'info'      => $Site->profile_info[$res],
                );
            }

            $this->ajaxReturn($info);
        }
    }


    /**
     * 设置站点状态
     */
    public function set($status){
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


}