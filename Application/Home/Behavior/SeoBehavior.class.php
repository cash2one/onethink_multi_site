<?php
/**
 * Home 模块获取SEO信息
 */
namespace Home\Behavior;
use Think\Behavior;

defined('THINK_PATH') or exit();

// 初始化钩子信息
class SeoBehavior extends Behavior {

    // 行为扩展的执行入口必须是run
    public function run(&$content){
        // 只在Home模块下执行
        if( BIND_MODULE == 'Home' ){
            $this->_seo();
        }
    }

    /**
     * 获取网页seo信息
     */
    protected function _seo(){

        $site= M("Site")->find(C("SITE_ID"));

        $seo['title']       = $site['title'];
        $seo['keywords']    = $site['keywords'];
        $seo['description'] = $site['description'];

        if( S('SEO_CATE') ){
            $category = S('SEO_CATE');
            $seo['title']       = $category['meta_title'];
            $seo['keywords']    = $category['keywords'];
            $seo['description'] = $category['description'];
        }

        if( S('SEO_ARTICLE') ){
            $article =  S('SEO_ARTICLE');

            $category = S('SEO_CATE');

            $seo['title']       = $article['title'];
            $seo['keywords']    = $article['keywords'];
            $seo['description'] = $article['description'];
            
            // title是否继承分类
            if( C('MULTI_TITLE') == 1 ){
                $seo['title'] = $category['title'] . ' - ' . $article['title'];
            }
        }  
        
        // 每次访问删除缓存
        S('SEO_ARTICLE',null);
        S('SEO_CATE',null);


        C('SEO_TITLE',$seo['title']);
        C('SEO_KEYWORDS',$seo['keywords']);
        C('SEO_DESCRIPTION',$seo['description']);

    }

}