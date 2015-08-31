<?php
namespace Admin\Controller\Profile;

class ChannelController extends \Admin\Controller\ProfileController {

    public function index(){
        $pid = I('get.pid', 0);
        /* 获取频道列表 */
        $map  = array('status' => array('gt', -1), 'pid'=>$pid, 'site_id'=>$this->site_id);
        $list = M('Channel')->where($map)->order('sort asc,id asc')->select();
        int_to_string($list,array(
                'status'=>array(
                    0=>"<span class='badge badge-danger'>禁用</span>",
                    1=>"<span class='badge badge-success'>开启</span>"
                )
            )
        );

        $this->assign('list', $list);
        $this->assign('pid', $pid);
        $this->meta_title = '导航管理';
        $this->display('Profile/Channel/index');
    }

    public function add(){
        $pid = I('get.pid', 0);
        //获取父导航
        if(!empty($pid)){
            $parent = M('Channel')->where(array('id'=>$pid))->field('title')->find();
            $this->assign('parent', $parent);
        }

        $this->assign('pid', $pid);
        $this->assign('info',null);
        $this->meta_title = '新增导航';
        $this->display('Profile/Channel/edit');
    }

    public function edit(){
        $id = I('id');
        $info = array();
        /* 获取数据 */
        $info = M('Channel')->find($id);
        if(false === $info){
            $this->error('获取配置信息错误');
        }

        $pid = I('get.pid', 0);
        //获取父导航
        if(!empty($pid)){
            $parent = M('Channel')->where(array('id'=>$pid))->field('title')->find();
            $this->assign('parent', $parent);
        }

        $this->assign('pid', $pid);
        $this->assign('info', $info);
        $this->meta_title = '编辑导航';
        $this->display('Profile/Channel/edit');
    }

    public function update(){
        $id = I('id');
        $Channel = D('Channel');
        $data = $Channel->create();
        if($data){
            if($id){

                if($Channel->save()){
                    $this->success('编辑成功', U('Profile/channel'));
                } else {
                    $this->error('编辑失败');
                }

            }else{

                $id = $Channel->add();
                if($id){
                    $this->success('新增成功', U('Profile/channel'));
                } else {
                    $this->error('新增失败');
                }

            }
        } else {
            $this->error($Channel->getError());
        }
    }

    public function del(){
        $id = array_unique((array)I('id',0));

        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }

        $map = array('id' => array('in', $id) );
        if(M('Channel')->where($map)->delete()){
            $this->success('删除成功');
        } else {
            $this->error('删除失败！');
        }
    }

    public function set(){
        $status = I('status');
        $id = array_unique((array)I('ids',0));

        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        if ( !in_array($status,array(0,1)) ) {
            $this->error('参数错误!');
        }

        $map = array('id' => array('in', $id) );
        if(M('Channel')->where($map)->setField("status",$status)){
            $this->success('操作成功');
        } else {
            $this->error('操作失败！');
        }
    }

    public function sort(){
        if(IS_GET){
            $ids = I('get.ids');
            $pid = I('get.pid');

            //获取排序的数据
            $map = array('status'=>array('gt',-1),'site_id'=>$this->site_id);
            if(!empty($ids)){
                $map['id'] = array('in',$ids);
            }else{
                if($pid !== ''){
                    $map['pid'] = $pid;
                }
            }
            $list = M('Channel')->where($map)->field('id,title')->order('sort asc,id asc')->select();

            $this->assign('list', $list);
            $this->meta_title = '导航排序';
            $this->display('Profile/Channel/sort');
        }elseif (IS_POST){
            $ids = I('post.ids');
            $ids = explode(',', $ids);
            foreach ($ids as $key=>$value){
                $res = M('Channel')->where(array('id'=>$value))->setField('sort', $key+1);
            }
            if($res !== false){
                $this->success('排序成功！');
            }else{
                $this->error('排序失败！');
            }
        }else{
            $this->error('非法请求！');
        }
    }
}