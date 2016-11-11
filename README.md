# PHP Generator

PHP generator helps you to build your PHP applications using easy-to-use
frameworks with simple structure.

## Getting Started
Clone (or download) the repository to a folder and install the
dependencies:
```
$ git clone https://github.com/juniorgarcia/php-webapp-generator
$ cd php-webapp-generator
$ composer install
$ npm install
$ bower install 
```

## Configuring the VirtualHost (Apache)
You'll have to configure a VirtualHost on Apache to get it working.
You can use this boilerplate:

```
<VirtualHost *:80>
    DocumentRoot /your/web/dir/your-app-folder
    ServerName yourapp.dev
    ServerAlias yourapp.dev
</VirtualHost>
```

**Don't forget** to configure your hosts file to point "<your_app_url>" to localhost.

## Folder structure
The structure is really simple:

* **.env.example**: The base file for your .env file. Rename it and then,
configure it as you wish. You **MUST** configure it. The structure is self-explanatory.
* **app** folder: The base of your application;
* **app/routes.php**: Your app's route list. Here we use [Silex](http://silex.sensiolabs.org/) to route the application;
* **app/templates**: Your template files should be in here. The content we have here is only for example. Use [Twig](http://twig.sensiolabs.org) to make your templates.

## Projects we used as inspiration
1. [Laravel](https://laravel.com/);
2. [Sage Wordpress Theme](https://github.com/roots/sage).