<?php
return array(
	'app_begin'=>array(
		'Behavior\CheckLangBehavior'
	),
    'view_begin'=>array(
        'Home\Behavior\SeoBehavior',
    ),
);