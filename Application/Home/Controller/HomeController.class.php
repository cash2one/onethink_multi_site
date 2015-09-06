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
		$this->service_error(L('_ERROR_404_'), '404');
	}

    public function service_error($message = '', $code = ''){

        if( $code == '404' ){
            header('HTTP/1.1 404 Not Found');
            header('Status:404 Not Found');
        }else{
            header('HTTP/1.1 503 Service Unavailable');
            header('Status: 503 Service Unavailable');
        }

        $this->assign('error_info', $message);
        $this->display('Public/404');
        exit;
    }

    protected function _initialize(){
        /* 读取站点配置 */
        $config = api('Config/lists');
        C($config); //添加配置

        if(!C('WEB_SITE_CLOSE')){
            $this->error(L('_WEB_SERVER_CLOSE_'));
        }

        // 初始化站点信息
        $this->_site_info();
    }

    protected function _site_info(){
        $site_id = $this->site_id = C('SITE_ID');
        $this->site_info = M("Site")->find($site_id);

        $cate_ids = D('Category')->where("site_id = ".$site_id)->getField('id',true);
        $this->cate_ids = array(
            'array'=>$cate_ids,
            'string'=>implode(',',$cate_ids)
        );
        $cate_list     =   D('Category')->where("site_id = ".$site_id)->getTree();
        $this->cate_list = $cate_list;
    }
    

}
