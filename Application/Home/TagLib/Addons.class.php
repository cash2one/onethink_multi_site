<?php
namespace Home\TagLib;
use Think\Template\TagLib;
/**
 * OT系统插件标签库
 */
class Addons extends TagLib{
    // 标签定义
    protected $tags   =  array(
        // 标签定义： attr 属性列表 close 是否闭合（0 或者1 默认1） alias 标签别名 level 嵌套层次

        'focus'     =>  array('attr'=>'group,name')
    );

    public function _focus($tag, $content){
        $group  = empty($tag['group'])? 'default' : $tag['group'];

        $parse  = '<?php ';
        $parse .= '$__FOCUS__ = D(\'Addons://Focus/Focus\')->getList("'.$group.'");';
        $parse .= '?><volist name="__FOCUS__" id="'.$tag['name'].'">';
        $parse .= $content;
        $parse .= '</volist>';
        return $parse;
    }
}