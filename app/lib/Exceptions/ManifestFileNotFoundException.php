<?php

namespace PHPWebAppGenerator\Exceptions;


use Symfony\Component\HttpFoundation\File\Exception\FileException;

class ManifestFileNotFoundException extends FileException
{
    protected $message = 'manifest.json file not found. Please, start the building proccess or
                change the environment to "development".';
    public function __construct()
    {
        parent::__construct($this->message);
    }
}