<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Home\Controller;
use Think\Controller;

/**
 * 前台公共控制器
 * 为防止多分组Controller名称冲突，公共Controller名称统一使用分组名称
 */
class HomeController extends Controller {

	protected $site_id = 0;
	protected $site_info = null;
	protected $cate_ids = null;
	protected $cate_list = null;

	/* 空操作，用于输出404页面 */
	public function _empty(){
		$this->redirect('Index/index');
	}


    protected function _initialize(){
        /* 读取站点配置 */
        $config = api('Config/lists');
        C($config); //添加配置

        if(!C('WEB_SITE_CLOSE')){
            $this->error('站点已经关闭，请稍后访问~');
        }

        $this->_site_choise();
        $this->_site_init();
    }
    
    /**
     * 根据域名来确定访问站点
     */
    protected function _site_choise(){
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
			$this->error("站点不存在，请确认！");
		}else if( $site_list[$site_id]['status'] == 0 ){
			$this->error('当前站点无法访问~');
		}else{
			$this->site_id = $site_id;
		}
    }

    protected function _site_init(){
    	$site_id = $this->site_id;

        $site_info = M("Site")->find($site_id);
        $this->site_info = $site_info;

        // 模板设置
        if( $site_info['theme'] ){
        	C('DEFAULT_THEME',$site_info['theme']);
        }else{
        	C('DEFAULT_THEME','default');
        }

        // 站点分类获取
        $cate_ids = D('Category')->where("site_id = ".$site_id)->getField('id',true);
        $this->cate_ids = array(
        	'array'=>$cate_ids,
        	'string'=>implode(',',$cate_ids)
        );
        $cate_list     =   D('Category')->where("site_id = ".$site_id)->getTree();
        $this->cate_list = $cate_list;
    }

}
