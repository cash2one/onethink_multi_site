<?php
/**
 * Home 模块自动识别站点
 */
namespace Home\Behavior;
use Think\Behavior;

defined('THINK_PATH') or exit();

// 初始化钩子信息
class InitSiteBehavior extends Behavior {

    // 行为扩展的执行入口必须是run
    public function run(&$content){
        // 只在Home模块下执行
        if( BIND_MODULE == 'Home' ){
            $this->_site_init();
        }
    }


    /**
     * 根据域名来确定访问站点
     */
    protected function _site_init(){
        $site_list = M('Site')->getField('id,domain,status');

        $domain_list = array();
        foreach( $site_list as $v ){
            $domain_list[$v['id']] = $v['domain'];
        }

        $host_name = I('server.HTTP_HOST');
        // 主域名
        $domain = "";
        // 二级域名
        $sub_domain ='';
        // 双后缀域
        $domain_suffix = array('com.cn','net.cn','gov.cn','org.cn');

        // 排除端口
        $port_start = strpos($host_name,':');
        if( $port_start ){
            $host_name = substr($host_name, 0, $port_start);
        }

        $host_name = explode('.',$host_name);
        $len = count($host_name);

        if( in_array( $host_name[$len-2].'.'.$host_name[$len-1] , $domain_suffix ) ){
            $domain = $host_name[$len-3].'.'.$host_name[$len-2].'.'.$host_name[$len-1];
            $sub_domain = $host_name[$len-4];
        }else{
            $domain = $host_name[$len-2].'.'.$host_name[$len-1];
            $sub_domain = $host_name[$len-3];
        }

        // 查询站点
        $site_id = array_search($domain, $domain_list);
        if( !$site_id ){
            exit("site is not exist!");
        }else if( $site_list[$site_id]['status'] == 0 ){
            exit('site closed!');
        }else{
            C('SITE_ID', $site_id);
        }

        // 模板设置
        $site_info = M("Site")->find($site_id);

        if( $site_info['theme'] ){
            C('DEFAULT_THEME',$site_info['theme']);
        }else{
            C('DEFAULT_THEME','default');
        }
        //C('VIEW_PATH','./'.C('THEME_PACKAGE').'/');

        // 读取站点设置
        // 分页数，伪静态，路由规则等等
        $site_config = json_decode($site_info['config'],1);

        foreach( $site_config as $k => $v ){
            C($k, $v);
        }



        /*
        // 站点分类获取
        // 后续控制器中执行
        $cate_ids = D('Category')->where("site_id = ".$site_id)->getField('id',true);
        $this->cate_ids = array(
            'array'=>$cate_ids,
            'string'=>implode(',',$cate_ids)
        );
        $cate_list     =   D('Category')->where("site_id = ".$site_id)->getTree();
        $this->cate_list = $cate_list;
        */
    }

}