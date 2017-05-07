<?php
// Bootstrapping our application
require_once __DIR__ . "/config.php";
require_once __DIR__ . "/routes.php";
// Start routing.
$app->run();