<?php
return array(
    'extends' => 'bootstrap3',
    'helpers' => array(
        'factories' => array(
            'content' => 'Finna\View\Helper\Root\Factory::getContent',
            'header' => 'Finna\View\Helper\Root\Factory::getHeader',
            'page' => 'Finna\View\Helper\Root\Factory::getPage',
            'record' => 'Finna\View\Helper\Root\Factory::getRecord',
            'recordImage' => 'Finna\View\Helper\Root\Factory::getRecordImage',
            'tabs' => 'Finna\View\Helper\Root\Factory::getTabs'

        )
    ),
    'css' => array(
        'vendor/dataTables.bootstrap.css',
        'vendor/magnific-popup.css',
        'dataTables.bootstrap.custom.css',
        'slick.css',
        'finnaicons.css',
        'finna.css'
    ),
    'js' => array(
        'finna.js',
        'image-popup.js',
        'vendor/jquery.dataTables.js',
        'vendor/dataTables.bootstrap.js',
        'slick.min.js',
        'vendor/jquery.magnific-popup.min.js'
    ),
    'less' => array(
        'active' => false
    ),
);
