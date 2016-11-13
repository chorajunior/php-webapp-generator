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

* **app** folder: the base of your application;
* **app/templates**: your template files should be in here. The content we have here is only for example. Use [Twig]
(http://twig.sensiolabs.org) to make your templates.

## File Structure
* **.env.example**: the base file for your .env file. Rename it and then,
* **app/bootstrap.php**: the file who bootstraps your application calling the dependencies and config file;
* **app/config.php**: your main app's configuration is here;
configure it as you wish. You **MUST** configure it. The structure of this file is self-explanatory and in most cases
you only need to change `ENV` and `APP_TITLE` variables;
* **app/routes.php**: your app's route list. Here we use [Silex](http://silex.sensiolabs.org/) to route the
application;
* **app/templates/base.twig**: the base for the application. All the application (should) inherit from this file;
* **app/templates/index.twig**: the index file. Don't have to be this file. It's used only as example.



##FAQ
Question: Do I need to use Twig?
<br>Answer: **No!** You can use PHP files, HTML files, and so on. The file type does not matter since Silex will
route for the file you tell it to. Altough, we recommend Twig, for it's really awesome and it's already configured to
use our helper functions. Don't be afraid :)

Question: [When I run `gulp watch`, assets don't show up. Why?](#assets-not-working)
<br>Answer: Check in your .env file for the value of `ENV`. Make sure it's not in `production`. `watch` task will
only work in development mode, for obvious reasons.

Question: [When I run `gulp watch` (and browserSync opens a new window for me in my browser), I got a blank page that
           never stops loading](#gulp-watch-dont-stop-loading-page).
<br>Answer: Check the file `/app/assets/config.json` to see if the value for `config.devUrl` matches the virtual host
you created. There is an example [in here](#configuring-virtual-host).

Question: [How can I add dependencies using Bower?](#how-to-add-dependencies-using-bower)
<br>Answer: Using `bower install <dependency> --save (or --save-dev, as you need it)` will work as magic. That's because
the Gulp task who compiles your assets automatically reads your `bower.json` file and adds your dependencies.

## Projects we used as inspiration
1. [Laravel](https://laravel.com/);
2. [Sage Wordpress Theme](https://github.com/roots/sage).