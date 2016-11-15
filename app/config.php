<?php

/******************************************** Loading the PHP dependencies. *******************************************/
use PHPWebAppGenerator\Assets;
use Symfony\Component\HttpFoundation\Response;

require_once __DIR__ . '/vendor/autoload.php';

/*************************************** Initializing the environment variables ***************************************/
$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT']);
$dotenv->load();
$dotenv->required(['ENV', 'APP_TITLE']);

// Setting the debug mode based on the current environment
define('DEBUG', getenv('ENV') !== 'production');

/************************** Initializing the router using Silex: http://silex.sensiolabs.org/ *************************/
$app = new Silex\Application(array('debug' => DEBUG));

// Registering Twig to use as template system.
$app->register(new \Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/templates',
));

// Enabling Twig cache just for production environment. By default we write on temporary system's folder to avoid
// permission issues.
if (!DEBUG) {
    $app['twig']->setCache(sys_get_temp_dir() . '/cache');
}

// Configuring the globals for Twig. These can be overridden
$twig = $app['twig'];
$twig->addGlobal('appTitle', getenv('APP_TITLE'));

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
$app['twig']->addFunction('script', new Twig_SimpleFunction('script', function($script) {
    echo Assets::getScript($script);
}));