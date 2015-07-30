<?php
namespace Admin\Controller;

/**
 * 后台配置控制器
 */
class SiteController extends AdminController {

    private $manages = array();

    public $profile_info = array(
        '-2' =>"数据保存失败",
        '-1' =>"没有选择要操作站点",
        '0' =>"所选栏目没有改变",
    );

    /**
     * 初始化
     */
    public function _initialize(){
        parent::_initialize();

        // 获取站点管理用户列表
        $this->manages = M("Member")->getField("uid,nickname");
    }

    /**
     * 站点列表
     */
    public function index(){
        $manages = $this->manages;

        $list       =   M("Site")->order('id asc')->select();
        int_to_string($list,array(
                'status'=>array(
                    0=>"<span class='badge badge-danger'>关闭</span>",
                    1=>"<span class='badge badge-success'>开启</span>"
                ),
                'manage'=>$manages
            )
        );
    
        $this->assign('list',$list);
        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);

        $this->meta_title = '站点列表';
        $this->display();
    }


    /**
     * 新增站点
     */
    public function add(){
        if(IS_POST){
            $Site = D('Site');
            $data = $Site->create();
            if($data){
                $id = $Site->add();
                if($id){
                    $this->success('新增成功', Cookie('__forward__'));
                } else {
                    $this->error('新增失败');
                }
            } else {
                $this->error($Site->getError());
            }
        } else {
            $this->assign('manages',$this->manages);
            $this->meta_title = '新增站点';
            $this->display('edit');
        }
    }

    /**
     * 编辑站点
     * @param  integer $id 站点id
     */
    public function edit($id = 0){
        if(IS_POST){
            $Site = D('Site');
            $data = $Site->create();
            if($data){
                if($Site->save()!== false){
                    $this->success('更新成功', Cookie('__forward__'));
                } else {
                    $this->error('更新失败');
                }
            } else {
                $this->error($Site->getError());
            }
        } else {
            $info = array();
            /* 获取数据 */
            $info = M('Site')->field(true)->find($id);
            $this->assign('info', $info);
            $this->assign('manages',$this->manages);
            $this->meta_title = '编辑站点';
            $this->display();
        }
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
     * 删除站点
     */
    public function del(){
        $id = array_unique((array)I('id',0));

        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }

        $map = array('id' => array('in', $id) );
        if(M('Site')->where($map)->delete()){
            $this->success('删除成功');
        } else {
            $this->error('删除失败！');
        }
    }

    /**
     * 批量导入数据
     */
    public function import(){
        if(IS_POST){
            $tree = I('post.tree');
            $lists = explode(PHP_EOL, $tree);
            $menuModel = M('Site');
            if($lists == array()){
                $this->error('请按格式填写批量导入的菜单，至少一个菜单');
            }else{
                $pid = I('post.pid');
                foreach ($lists as $key => $value) {
                    $record = explode('|', $value);
                    if(count($record) == 2){
                        $menuModel->add(array(
                            'title'=>$record[0],
                            'url'=>$record[1],
                            'pid'=>$pid,
                            'sort'=>0,
                            'hide'=>0,
                            'tip'=>'',
                            'is_dev'=>0,
                            'group'=>'',
                        ));
                    }
                }
                session('ADMIN_MENU_LIST',null);
                $this->success('导入成功',U('index?pid='.$pid));
            }
        }else{
            $this->meta_title = '批量导入站点';
            $pid = (int)I('get.pid');
            $this->assign('pid', $pid);
            $data = M('Site')->where("id={$pid}")->field(true)->find();
            $this->assign('data', $data);
            $this->display();
        }
    }


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
        $this->display('Site/Profile/mysite');
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


        $cate_list     =   D('Category')->getTree();
        $this->assign('cate_list',     $cate_list);

        $this->assign("info",$site_info);
        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);
        $this->meta_title = '管理站点';
        $this->display('Site/Profile/manage');
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