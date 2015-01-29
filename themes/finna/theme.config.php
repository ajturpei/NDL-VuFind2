<?php
return array(
    'extends' => 'bootstrap3',
    'helpers' => array(
        'factories' => array(
            'content' => 'Finna\View\Helper\Root\Factory::getContent',
            'header' => 'Finna\View\Helper\Root\Factory::getHeader',
        )
    ),
    'css' => array(
        'vendor/dataTables.bootstrap.css',
        'dataTables.bootstrap.custom.css',
        'slick.css',
        'finnaicons.css',
        'compiled.css',
        'bootstrap-custom.css'
    ),
    'js' => array(
        'finna.js',
        'vendor/jquery.dataTables.js',
        'vendor/dataTables.bootstrap.js',
        'slick.min.js',
    ),
    'less' => array(
        'active' => false
    ),
);
