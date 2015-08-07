<?php
namespace Admin\Controller;

/**
 * 个人中心
 */
class ProfileController extends AdminController {

    protected $site_id = null;

    protected function _initialize(){
        parent::_initialize();

        $this->site_id = session('site_id');

        // 获取当前站点相关信息
        if( $this->site_id ){
            $this->_getSiteInfo($this->site_id);
        }
    }

    protected function _getSiteInfo($site_id){
        $status = array(0=>'关闭',1=>'开启');
        $site_info = M("Site")->find($site_id);
        $site_info['status_text'] = $status[$site_info['status']];
        if( !$site_info ){
            $this->error("站点不存在！");
        }
        if( $site_info['manage'] != UID ){
            $this->error("您无权管理他人站点！");
        }

        $nickname = M("Member")->where("uid = ".$site_info['manage'])->getField('nickname');
        $site_info['manage_nickname'] = $nickname;

        $site_info['config'] = json_decode($site_info['config'],1);

        $cate_list     =   D('Category')->where("site_id = ".$site_id)->getTree();

        $this->assign('site_cate_list',     $cate_list);
        $this->assign("site_info",          $site_info);
    }

    public function siteInfo(){
        $this->display('siteinfo');
    }

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
        $Site->$a();

    }

    /**
     * 管理站点栏目
     */
    public function cate(){
        $a = I('get.cmethod','index');

        $Category = new Profile\CategoryController();
        $Category->$a();
    }

    public function editCateTree($tree = null){
        $this->assign('tree', $tree);
        $this->display('Profile/Category/tree');
    }

    public function listCateTree($tree = null){
        $this->assign('tree', $tree);
        $this->display('Profile/Article/tree');
    }

    /**
     * 管理站点文章
     */
    public function article(){
        $a = I('get.amethod','index');

        $Article = new Profile\ArticleController();
        $Article->$a();
    }

    /**
     * 管理站点导航
     */
    public function channel(){
        $a = I('get.cmethod','index');

        $Channel = new Profile\ChannelController();
        $Channel->$a();
    }
}