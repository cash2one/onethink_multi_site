<?php
namespace Admin\Controller\Profile;

/**
 * 后台配置控制器
 */
class CategoryController extends \Admin\Controller\ProfileController {

    public function index(){
        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);
        $this->meta_title = '栏目管理';
        $this->display('Profile/Category/index');
    }

    /* 编辑分类 */
    public function edit(){
        $Category = D('Category');
        $cate = '';
        $id = I('id');
        $pid = I('pid');

        if($pid){
            /* 获取上级分类信息 */
            $cate = $Category->info($pid, 'id,name,title,status');
            if(!($cate && 1 == $cate['status'])){
                $this->error('指定的上级分类不存在或被禁用！');
            }
        }

        $sites = M("Site")->getField('id,domain');
        $this->assign('sites',  $sites);

        /* 获取分类信息 */
        $info = $id ? $Category->info($id) : '';

        $this->assign('info',       $info);
        $this->assign('category',   $cate);
        $this->meta_title = '编辑分类';
        $this->display('Profile/Category/edit');
    }

    /* 新增分类 */
    public function add(){
        $Category = D('Category');
        $cate = array();
        $pid = I('pid');
        $site_id = I('site_id');

        if( $site_id ){
            $this->assign('site_id',$site_id);
        }

        if($pid){
            /* 获取上级分类信息 */
            $cate = $Category->info($pid, 'id,name,title,status');
            if(!($cate && 1 == $cate['status'])){
                $this->error('指定的上级分类不存在或被禁用！');
            }
            $site_id = $cate['site_id'];
        }

        $sites = M("Site")->getField('id,domain');
        $this->assign('sites',  $sites);

        /* 获取分类信息 */
        $this->assign('info',     array('site_id'=>$site_id));
        $this->assign('category', $cate);
        $this->meta_title = '新增分类';
        $this->display('Profile/Category/edit');
    }

    public function update(){
        $Category = D('Category');
        $id = I('id');
        // 修改被移动菜单所属站点
        $site_id = I('site_id');
        if($id) $site_id_old = M("Category")->where("id = $id ")->getField('site_id');

        if(false !== $Category->update()){
            if( $site_id && $site_id_old && $site_id != $site_id_old ){
                $Category->recursion_to_site($id, $site_id);
            }
            
            $this->success('编辑成功！', U('Profile/cate'));
        } else {
            $error = $Category->getError();
            $this->error(empty($error) ? '未知错误！' : $error);
        }
    }

    /**
     * 删除一个分类
     * @author huajie <banhuajie@163.com>
     */
    public function remove(){
        $cate_id = I('id');
        if(empty($cate_id)){
            $this->error('参数错误!');
        }

        //判断该分类下有没有子分类，有则不允许删除
        $child = M('Category')->where(array('pid'=>$cate_id))->field('id')->select();
        if(!empty($child)){
            $this->error('请先删除该分类下的子分类');
        }

        //判断该分类下有没有内容
        $document_list = M('Document')->where(array('category_id'=>$cate_id))->field('id')->select();
        if(!empty($document_list)){
            $this->error('请先删除该分类下的文章（包含回收站）');
        }

        //删除该分类信息
        $res = M('Category')->delete($cate_id);
        if($res !== false){
            //记录行为
            action_log('update_category', 'category', $cate_id, UID);
            $this->success('删除分类成功！');
        }else{
            $this->error('删除分类失败！');
        }
    }

    /**
     * 操作分类初始化
     * @param string $type
     * @author huajie <banhuajie@163.com>
     */
    public function operate($type = 'move'){
        //检查操作参数
        if(strcmp($type, 'move') == 0){
            $operate = '移动';
        }elseif(strcmp($type, 'merge') == 0){
            $operate = '合并';
        }else{
            $this->error('参数错误！');
        }
        $from = intval(I('get.from'));
        empty($from) && $this->error('参数错误！');

        //获取分类
        $map = array('status'=>1, /*'site_id'=>,*/ 'id'=>array('neq', $from));
        $list = M('Category')->where($map)->field('id,pid,title')->select();


        //移动分类时增加移至根分类
        if(strcmp($type, 'move') == 0){
            //不允许移动至其子孙分类
            $list = tree_to_list(list_to_tree($list));

            $pid = M('Category')->getFieldById($from, 'pid');
            $pid && array_unshift($list, array('id'=>0,'title'=>'根分类'));
        }

        $this->assign('type', $type);
        $this->assign('operate', $operate);
        $this->assign('from', $from);
        $this->assign('list', $list);
        $this->meta_title = $operate.'分类';
        $this->display('Profile/Category/operate');
    }

    /**
     * 移动分类
     * @author huajie <banhuajie@163.com>
     */
    public function move(){
        $to = I('post.to');
        $from = I('post.from');
        $res = M('Category')->where(array('id'=>$from))->setField('pid', $to);

        // 修改被移动菜单所属站点
        $site_id = M("Category")->where("id = $to ")->getField('site_id');
        $site_id_old = M("Category")->where("id = $from ")->getField('site_id');
        if( $site_id && $site_id != $site_id_old ){
            D("Category")->recursion_to_site($from, $site_id);
        }

        if($res !== false){
            $this->success('分类移动成功！', U('index'));
        }else{
            $this->error('分类移动失败！');
        }
    }

    /**
     * 合并分类
     * @author huajie <banhuajie@163.com>
     */
    public function merge(){
        $to = I('post.to');
        $from = I('post.from');
        $Model = M('Category');

        //检查分类绑定的模型
        $from_models = explode(',', $Model->getFieldById($from, 'model'));
        $to_models = explode(',', $Model->getFieldById($to, 'model'));
        foreach ($from_models as $value){
            if(!in_array($value, $to_models)){
                $this->error('请给目标分类绑定' . get_document_model($value, 'title') . '模型');
            }
        }

        //检查分类选择的文档类型
        $from_types = explode(',', $Model->getFieldById($from, 'type'));
        $to_types = explode(',', $Model->getFieldById($to, 'type'));
        foreach ($from_types as $value){
            if(!in_array($value, $to_types)){
                $types = C('DOCUMENT_MODEL_TYPE');
                $this->error('请给目标分类绑定文档类型：' . $types[$value]);
            }
        }

        //合并文档
        $res = M('Document')->where(array('category_id'=>$from))->setField('category_id', $to);

        if($res !== false){
            //删除被合并的分类
            $Model->delete($from);
            $this->success('合并分类成功！', U('index'));
        }else{
            $this->error('合并分类失败！');
        }

    }


    /**
     * 分类排序
     */
    public function sort(){
        $ids = I('post.ids');
        $ids = explode(',', $ids);
        foreach ($ids as $key=>$value){
            $res = M('Category')->where(array('id'=>$value))->setField('sort', $key+1);
        }
        if($res !== false){
            $this->success('排序成功！');
        }else{
            $this->eorror('排序失败！');
        }
    }
}