<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Home\Controller;

/**
 * 文档模型控制器
 * 文档模型列表和详情
 */
class ArticleController extends HomeController {

	// 当前栏目
	public $category;
	// 当前栏目父栏目数组
	public $parent_cate;

    /* 文档模型频道页 */
	public function index(){
		/* 分类信息 */
		$category = $this->_category();

		//频道页只显示模板，默认不读取任何内容
		//内容可以通过模板标签自行定制

		/* 模板赋值并渲染模板 */
		$this->assign('category', $category);
		$this->display($category['template_index']);
	}

	/* 文档模型列表页 */
	public function lists(){
		/* 分类信息 */
		$category = $this->_category();

		/* 模板赋值并渲染模板 */
		$this->assign('category', $category);
		$this->display($category['template_lists']);
	}

	/* 文档模型详情页 */
	public function detail($id = 0, $p = 1){
		/* 标识正确性检测 */
		if(!($id && is_numeric($id))){
			$this->error('文档ID错误！');
		}

		/* 页码检测 */
		$p = intval($p);
		$p = empty($p) ? 1 : $p;

		/* 获取详细信息 */
		$Document = D('Document');
		$info = $Document->detail($id);
		if(!$info){
			$this->error($Document->getError());
		}

		/* 分类信息 */
		$category = $this->_category($info['category_id']);

		/* 获取模板 */
		if(!empty($info['template'])){//已定制模板
			$tmpl = $info['template'];
		} elseif (!empty($category['template_detail'])){ //分类已定制模板
			$tmpl = $category['template_detail'];
		} else { //使用默认模板
			$tmpl = 'Article/'. get_document_model($info['model_id'],'name') .'/detail';
		}

		/* 更新浏览数 */
		$map = array('id' => $id);
		$Document->where($map)->setInc('view');

		/* 模板赋值并渲染模板 */
		$this->assign('category', $category);
		$this->assign('info', $info);
		$this->assign('page', $p); //页码
		$this->display($tmpl);
	}

	/* 文档分类检测 */
	private function _category($id = 0){
		/* 标识正确性检测 */
		$id = $id ? $id : I('get.category', 0);
		if(empty($id)){
			$this->error('没有指定文档分类！');
		}

		/* 获取分类信息 */
		$category = $this->category = D('Category')->info($id);

		if( !in_array($category['id'], $this->cate_ids['array']) ){
			$this->error('分类不存在。');
		}

		// 获取面包屑导航
		$parent_cate = $this->parent_cate = $this->_get_parent_category($category['id']);
		// 高亮主导航
		//$current_main_menu = $this->_hight_light_nav();

		if($category && 1 == $category['status']){
			switch ($category['display']) {
				case 0:
					$this->error('该分类禁止显示！');
					break;
				//TODO: 更多分类显示状态判断
				default:
					return $category;
			}
		} else {
			$this->error('分类不存在或被禁用！');
		}
	}

	/**
	 * 面包屑导航
	 * @param  [type] $cid [description]
	 * @return [type]      [description]
	 */
	private function _get_parent_category($cid){
	    if(empty($cid)){
	        return false;
	    }
	    $cates  =   M('Category')->where(array('status'=>1))->field('id,title,pid')->order('sort')->select();
	    $child  =   get_category($cid); //获取参数分类的信息
	    $pid    =   $child['pid'];
	    $temp   =   array();
	    $res[]  =   $child;
	    while(true){
	        foreach ($cates as $key=>$cate){
	            if($cate['id'] == $pid){
	                $pid = $cate['pid'];
	                array_unshift($res, $cate); //将父分类插入到数组第一个元素前
	            }
	        }
	        if($pid == 0){
	            break;
	        }
	    }
	    return $res;
	}

	/**
	 * 高亮主导航
	 * @return [type] [description]
	 */
	private function _hight_light_nav(){
		$site_id = $this->site_id;
		$nav = M('Channel')->where("status=1 and site_id=$site_id")->order("sort")->select();
	}

}
