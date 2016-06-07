<?php

/******************************************** Loading the PHP dependencies. *******************************************/
require_once __DIR__ . '/vendor/autoload.php';

/*************************************** Initializing the environment variables ***************************************/
$dotenv = new \Dotenv\Dotenv($_SERVER['DOCUMENT_ROOT']);
$dotenv->load();
$dotenv->required(['ENV', 'SITE_TITLE']);

// Setting the debug mode based on the current environment
define('DEBUG', getenv('ENV') == 'development');

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
$app['twig']->addGlobal('siteTitle', getenv('SITE_TITLE'));

$assets = new PHPAppGenerator\Assets();
var_dump($assets->getScript("a.js"));

/************************************************* Application routes. ************************************************/
$app->get('/', function() use($app) {
    return $app['twig']->render('index.twig');
});

// Start routing.
$app->run();