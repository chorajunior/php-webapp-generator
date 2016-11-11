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

##[Configuring the VirtualHost (Apache)](#configuring-virtual-host)
<br>You'll have to configure a VirtualHost on Apache to get it working.
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
* **app/routes.php**: Your app's route list. Here we use [Silex](http://silex.sensiolabs.org/) to route the
application;
* **app/templates**: Your template files should be in here. The content we have here is only for example. Use [Twig]
(http://twig.sensiolabs.org) to make your templates.

##FAQ
Question: When I run `gulp watch`, assets don't show up. Why?
<br>Answer: Check in your .env file for the value of `ENV`. Make sure it's not in `production`. `watch` task will
only work in development mode, for obvious reasons.

Question: When I run `gulp watch` (and browserSync opens a new window for me in my browser), I got a blank page that
never stops loading.
<br>Answer: Check the file `/app/assets/config.json` to see if the value for `config.devUrl` matches the virtual host
you created. There is an example [in here](#configuring-virtual-host).
   

## Projects we used as inspiration
1. [Laravel](https://laravel.com/);
2. [Sage Wordpress Theme](https://github.com/roots/sage).