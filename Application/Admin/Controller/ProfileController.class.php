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
     * 编辑站点基本信息
     */
    public function site(){
        $uid        =  UID;
        $list       =   M("Site")->where("manage=$uid")->order('id asc')->select();
        int_to_string($list,array('status'=>array(0=>"关闭",1=>"开启")));
    
        $this->assign('list',$list);
        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);

        $this->meta_title = '我的站点';
        $this->display();
    }

    public function editsite(){
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

    public function manage(){
        $id = I('get.id');

        if(empty($id)){
            $this->error("请选择要管理的站点！");
        }

        $site_info = M("Site")->find($id);
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
        $this->display();
    }

    public function category(){
        $cid = I("cid");
        $site_id = I("site_id");

        if( empty($site_id) ){
            $this->error("参数错误，没有指定要操作的站点");
        }

        $cid = implode(',',$cid);

        $res = M("Site")->where("id = $site_id ")->setField('category',$cid);

        if( $res ){
            $this->success("添加分类成功！");
        }
    }

}