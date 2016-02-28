<?php

class config_tpl_admin_quiz_ques{
    function get_config(){
        $cfg = TPL::load_config('admin/common');
        
        return TPL::extend_config($cfg, array(
            'css' => array(
                
            ),
            'less' => array(
                'admin/less/quiz_ques'
            ),
            'js'  => array(
                'admin/js/quiz_ques'
                
            ),
            'navi'  => array(
                array(
                    '题目管理',
                    '?c=admin&a=quiz_ques'
                )
            )
        ));
        
    }
}