<?php

use PHPAppGenerator\Assets;

/******************************************** Loading the PHP dependencies. *******************************************/
require_once __DIR__ . '/vendor/autoload.php';

/*************************************** Initializing the environment variables ***************************************/
$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT']);
$dotenv->load();
$dotenv->required(['ENV', 'SITE_TITLE']);

// Setting the debug mode based on the current environment
define('DEBUG', getenv('ENV') !== 'production');

/************************** Initializing the router using Silex: http://silex.sensiolabs.org/ *************************/
$app = new Silex\Application(array('debug' => DEBUG));

// Registering Twig to use as template system.
$app->register(new \Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/templates',
));

// Enabling Twig cache just if the environment is development
if (DEBUG) {
    $app['twig']->setCache(__DIR__ . '/cache');
}

// Configuring the globals for the Twig. These can be overridden
$twig = $app['twig'];
$twig->addGlobal('siteTitle', getenv('SITE_TITLE'));

// Adding assets functions to Twig Environment
$assets = new Assets();
$twig->addFunction(new Twig_SimpleFunction('script', function($script) {
    echo Assets::getScript($script);
}));
$app['twig']->addFunction('style', new Twig_SimpleFunction('style', function($style) {
    echo Assets::getStyle($style);
}));
$app['twig']->addFunction('image', new Twig_SimpleFunction('image', function($image) {
    echo Assets::getImage($image);
}));

/************************************************* Application routes. ************************************************/
$app->get('/', function() use($twig) {
    return $twig->render('index.twig');
});

// Start routing.
$app->run();