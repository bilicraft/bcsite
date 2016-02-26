<?php

class config_tpl_quiz_main{
    
    function get_config(){
        // 继承配置
        $cfg = TPL::load_config('public/common');
        return TPL::extend_config($cfg, array(
            'css' => [
                
            ],
            'less' => [
                'quiz/less/main'
            ],
            'js'  => [
                'skin/js/three.min',
                'quiz/js/char',
                'quiz/js/main'
            ],
            'navi' => [
                [
                    '答题',
                    './?c=quiz'
                ]
            ]
        ));
    }
}