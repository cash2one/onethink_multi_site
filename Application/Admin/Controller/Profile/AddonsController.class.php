<?php
namespace Admin\Controller\Profile;

/**
 * 后台配置控制器
 */
class AddonsController extends \Admin\Controller\ProfileController {

    public function index(){

        $addons_name = I('name',null);

        if( empty($addons_name) ){
            $this->assign('list', null);
        }else{
            $this->assign('name', $addons_name);
            $class = get_addon_class($addons_name);
            if(!class_exists($class)){
                $this->error('插件不存在');
            }
            $addon = new $class();
            $this->assign('addon', $addon);
            $param = $addon->admin_list;
            if(!$param){
                $this->error('插件列表信息不正确');
            }
            $this->meta_title = $addon->info['title'];
            $this->assign('title', $addon->info['title']);
            extract($param);

            if(!isset($fields))
                $fields = '*';
            if(!isset($search_key))
                $key = 'title';
            else
                $key = $search_key;
            if(isset($_REQUEST[$key])){
                $map[$key] = array('like', '%'.$_GET[$key].'%');
                unset($_REQUEST[$key]);
            }

            $arr_search = array(
                '[EDIT]',
                '[DELETE]'
             );
            $arr_replace = array(
                'Profile/addons?amethod=edit&id=[id]&name='.$addons_name,
                'Profile/addons?amethod=del&ids=[id]&name='.$addons_name
            );

            $list_grid = str_replace($arr_search, $arr_replace, $list_grid);

            if(isset($model)){
                $model  =   D("Addons://{$name}/{$model}");
                // 条件搜索
                $map    =   array();
                foreach($_REQUEST as $name=>$val){
                    if($fields == '*'){
                        $fields = $model->getDbFields();
                    }
                    if(in_array($name, $fields)){
                        $map[$name] = $val;
                    }
                }
                if(!isset($order))  $order = '';
                $list = $this->lists($model->field($fields),$map,$order);
                $fields = array();
                foreach ($list_grid as &$value) {
                    // 字段:标题:链接
                    $val = explode(':', $value);
                    // 支持多个字段显示
                    $field = explode(',', $val[0]);
                    $value = array('field' => $field, 'title' => $val[1]);
                    if(isset($val[2])){
                        // 链接信息
                        $value['href'] = $val[2];
                        // 搜索链接信息中的字段信息
                        preg_replace_callback('/\[([a-z_]+)\]/', function($match) use(&$fields){$fields[]=$match[1];}, $value['href']);
                    }
                    if(strpos($val[1],'|')){
                        // 显示格式定义
                        list($value['title'],$value['format']) = explode('|',$val[1]);
                    }
                    foreach($field as $val){
                        $array = explode('|',$val);
                        $fields[] = $array[0];
                    }
                }
                $this->assign('model', $model->model);
                $this->assign('list_grid', $list_grid);
            }
            $this->assign('_list', $list);
        }

        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);
        $this->meta_title = '插件管理';
        $this->display('Profile/Addons/index');
    }

   public function execute($_addons = null, $_controller = null, $_action = null){
        if(C('URL_CASE_INSENSITIVE')){
            $_addons        =   ucfirst(parse_name($_addons, 1));
            $_controller    =   parse_name($_controller,1);
        }

        $TMPL_PARSE_STRING = C('TMPL_PARSE_STRING');
        $TMPL_PARSE_STRING['__ADDONROOT__'] = __ROOT__ . "/Addons/{$_addons}";
        C('TMPL_PARSE_STRING', $TMPL_PARSE_STRING);

        if(!empty($_addons) && !empty($_controller) && !empty($_action)){
            $Addons = A("Addons://{$_addons}/{$_controller}")->$_action();
        } else {
            $this->error('没有指定插件名称，控制器或操作！');
        }
    }

    public function edit(){

        $name   = I('param.name',null) ;
        if( is_null($name) ){
            $name = I('get.name');
        }
        $id     = I('id',0);

        $this->assign('name', $name);
        $class = get_addon_class($name);

        if(!class_exists($class))
            $this->error('插件不存在');
        $addon = new $class();
        $this->assign('addon', $addon);
        $param = $addon->admin_list;
        if(!$param)
            $this->error('插件列表信息不正确');
        extract($param);
        $this->assign('title', $addon->info['title']);
        if(isset($model)){
            $addonModel = D("Addons://{$name}/{$model}");
            if(!$addonModel)
                $this->error('模型无法实列化');
            $model = $addonModel->model;
            $this->assign('model', $model);
        }
        if($id){
            $data = $addonModel->find($id);
            $data || $this->error('数据不存在！');
            $this->assign('data', $data);
        }

        if(IS_POST){
            // 获取模型的字段信息
            if(!$addonModel->create())
                $this->error($addonModel->getError());

            if($id){
                $flag = $addonModel->save();
                if($flag !== false)
                    $this->success("编辑{$model['title']}成功！", Cookie('__forward__'));
                else
                    $this->error($addonModel->getError());
            }else{
                $flag = $addonModel->add();
                if($flag)
                    $this->success("添加{$model['title']}成功！", Cookie('__forward__'));
            }
            $this->error($addonModel->getError());
        } else {
            $fields = $addonModel->_fields;
            $this->assign('fields', $fields);
            $this->meta_title = $id? '编辑'.$model['title']:'新增'.$model['title'];
            if($id)
                $template = $model['template_edit']? $model['template_edit']: '';
            else
                $template = $model['template_add']? $model['template_add']: '';
            if ($template)
                $this->display($addon->addon_path . $template);
            else
                $this->display('Profile/Addons/edit');
        }
    }

    public function del(){


        $name   = I('param.name',null) ;
        if( is_null($name) ){
            $name = I('get.name');
        }

        $ids = array_unique((array)I('ids',0));

        if ( empty($ids) ) {
            $this->error('请选择要操作的数据!');
        }

        $class = get_addon_class($name);
        if(!class_exists($class))
            $this->error('插件不存在');
        $addon = new $class();
        $param = $addon->admin_list;
        if(!$param)
            $this->error('插件列表信息不正确');
        extract($param);
        if(isset($model)){
            $addonModel = D("Addons://{$name}/{$model}");
            if(!$addonModel)
                $this->error('模型无法实列化');
        }
        $map = array('id' => array('in', $ids) );
        if($addonModel->where($map)->delete()){
            $this->success('删除成功');
        } else {
            $this->error('删除失败！');
        }
    }


}