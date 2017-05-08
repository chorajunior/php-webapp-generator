# PHP Web App Generator

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
<br>You'll have to configure a VirtualHost on Apache to get it working.
You can use this boilerplate:

```
<VirtualHost *:80>
    DocumentRoot /your/web/dir/your-app-folder/public
    ServerName yourapp.dev
    ServerAlias yourapp.dev

    <Directory  /your/web/dir/your-app-folder/public>
        AllowOverride All
    </Directory>
</VirtualHost>
```

1. **Don't forget** to configure your hosts file to point "your-app-url" to localhost;
2. **Don't forget** that your `DocumentRoot` **and** `<Dicrectory>` value must point to "your-app-folder/**public**".

## Folder structure
The structure is really simple:

* **app** folder: the base of your application;
* **app/templates**: your template files should be in here. The content we have here is only for example. Use [Twig]
(http://twig.sensiolabs.org) to make your templates.

## File Structure
* **.env.example**: the base file for your .env file. Rename it do `.env` to make your app start working.
* **app/bootstrap.php**: the file who bootstraps your application calling the dependencies and config file;
* **app/config.php**: your main app's configuration is here;
configure it as you wish. You **MUST** configure it. The structure of this file is self-explanatory and in most cases
you only need to change `ENV` and `APP_TITLE` variables;
* **app/routes.php**: your app's route list. Here we use [Silex](http://silex.sensiolabs.org/) to route the
application;
* **app/templates/base.twig**: the base for the application. All the application (should) inherit from this file;
* **app/templates/index.twig**: the index file. Don't have to be this file. It's used only as example.

## FAQ
Check out [our wiki](https://github.com/juniorgarcia/php-webapp-generator/wiki/FAQ).

## Projects we used as inspiration
1. [Laravel](https://laravel.com/);
2. [Sage Wordpress Theme (main JavaScript file.)](https://github.com/roots/sage);
3. [HTML 5 Boilerplate (.htaccess)](https://html5boilerplate.com/).
