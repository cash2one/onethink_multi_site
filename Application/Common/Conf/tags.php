<?php
return array(
	'app_init'=>array(
		'Common\Behavior\InitHookBehavior',
		'Home\Behavior\InitSiteBehavior',
	),
    'view_begin'=>array(
        'Home\Behavior\SeoBehavior',
    ),
);