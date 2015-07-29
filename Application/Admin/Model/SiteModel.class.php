<?php
namespace Admin\Model;
use Think\Model;

class SiteModel extends Model {

    protected $_validate = array(
        array('domain','require','标题必须填写'), 
    );

    /* 自动完成规则 */
    protected $_auto = array(
        array('status', '1', self::MODEL_INSERT),
    );

}