<?php
/************************************************* Application routes. ************************************************/
// Register your application routes in here using Silex: http://silex.sensiolabs.org

$app->get('/', function() use($twig) {
    return $twig->render('index.twig');
});