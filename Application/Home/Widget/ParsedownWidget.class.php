<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Home\Widget;
use Think\Controller;
use Home\Service\Parsedown;

/**
 * 分类widget
 * 用于动态调用分类信息
 */

class ParsedownWidget extends Controller{
	
	public function index($s){
		$Parsedown = new Parsedown();

		$text = $Parsedown->text($s);

		$this->assign('text', $text);
		$this->display('Parsedown/index');
	}
	
}
