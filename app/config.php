<?php

/******************************************** Loading the PHP dependencies. *******************************************/
use PHPWebAppGenerator\Assets;

require_once __DIR__ . '/vendor/autoload.php';

/*************************************** Initializing the environment variables ***************************************/
$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT']);
$dotenv->load();
$dotenv->required(array('ENV', 'APP_TITLE'));

// Setting the debug mode based on the current environment
define('DEBUG', getenv('ENV') !== 'production');

/************************** Initializing the router using Silex: http://silex.sensiolabs.org/ *************************/
$app = new Silex\Application(array('debug' => DEBUG));

// Registering Twig to use as template system.
$app->register(new \Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/templates',
    'twig.options' => array(
        'cache' => DEBUG ? sys_get_temp_dir() : null
    ),
));

// Configuring the globals for Twig. These can be overridden
/** @var $twig Twig_Environment */
$twig = $app['twig'];
$twig->addGlobal('appTitle', getenv('APP_TITLE'));

// Adding assets functions to Twig Environment
$assets = new Assets();
$appFunctions = array(
    'script' => new Twig_SimpleFunction('script', function($script) {
        echo Assets::getScript($script);
    }),
    'style' => new Twig_SimpleFunction('style', function($style) {
        echo Assets::getStyle($style);
    }),
    'image' => new Twig_SimpleFunction('image', function($image) {
        echo Assets::getImage($image);
    }),
);

// Iterating in the array of the Twig custom functions.
foreach($appFunctions as $fnName => $fnObj) {
    $twig->addFunction($fnName, $fnObj);
}