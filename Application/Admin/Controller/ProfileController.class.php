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

        $Site = new Profile\SiteController();
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
     * 管理站点栏目
     * @return [type] [description]
     */
    public function cate(){
        $a = I('get.cmethod');

        $Category = new Profile\CategoryController();
        $Category->$a();
    }

    public function catetree($tree = null){
        $this->assign('tree', $tree);
        $this->display('Profile/Category/tree');
    }

}