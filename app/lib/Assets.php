<?php

namespace PHPWebAppGenerator;

use PHPWebAppGenerator\Exceptions\ManifestFileNotFoundException;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

class Assets
{
    // The main paths
    public static $assetsFolder;
    public static $baseAppFolder;
    public static $scriptsFolder;
    public static $stylesFolder;
    public static $imagesFolder;
    public static $fontsFolder;
    public static $buildFolder;
    public static $distFolder;
    public static $config;

    /**
     * Content of the manifest file.
     * @var string
     */
    public static $manifestFileContent;

    // The asset types
    private static $validAssetTypes = array('script', 'style', 'image', 'font');

    public function __construct()
    {
        // Initializing the variables that point to the default folders
        self::$baseAppFolder = $_SERVER['DOCUMENT_ROOT'] . '/';

        self::initConfig();

        // Initializing base config based on config.json
        self::$assetsFolder  = self::$config['paths']['source'];
        self::$buildFolder   = self::$config['paths']['build'];
        self::$distFolder    = self::$config['paths']['dist'];
        self::$scriptsFolder = self::$config['paths']['scripts'];
        self::$stylesFolder  = self::$config['paths']['styles'];
        self::$imagesFolder  = self::$config['paths']['images'];
        self::$fontsFolder   = self::$config['paths']['fonts'];

        // Only initialize the manifest map if in production.
        if (self::isInProductionMode()) {
            self::initManifestFile();
        }
    }

    /**
     * Reads the config file also used to Gulpfile to process the assets to maintain the config DRY.
     * By default, this file is /app/assets/config.json. If the file exists, it will be parsed to a local variable.
     * @return array|null
     * @throws FileNotFoundException
     */
    public static function initConfig()
    {
        if (file_exists(self::$baseAppFolder . '../app/assets/config.json')) {
            self::$config = json_decode(file_get_contents(self::$baseAppFolder . '../app/assets/config.json'), true);
        } else {
            Throw new FileNotFoundException('config.json not found.');
        }

        return self::$config;
    }

    /**
     * Returns the path of an asset it exists. Empty string, otherwise.
     * @throws ManifestFileNotFoundException
     *
     * @param string $path The path to the asset
     *
     * @return string
     */
    public static function getAsset($path)
    {
        if (self::isInProductionMode()) {
            // Verifying the existence of the manifest with the asset's maps
            if (self::manifestFileExists()) {
                return self::getProductionAsset($path);
            } else {
                throw new ManifestFileNotFoundException();
            }
        } else {
            return self::$assetsFolder . '/' . $path;
        }
    }

    /**
     * Returns the asset for production.
     *
     * @param string $path
     *
     * @return string The production asset.
     */
    private static function getProductionAsset($path)
    {
        $productionAssetPath = '';
        if (array_key_exists($path, self::$manifestFileContent)) {
            $productionAssetPath = self::$manifestFileContent[$path];
        } else {
            throw new \UnexpectedValueException("There is no asset in the manifest file with the identifier: \"{$path}\"");
        }

        return self::$assetsFolder
               . '/' .
               self::$buildFolder
               . '/' .
               $productionAssetPath;
    }

    /**
     * Verify the existence of the manifest file.
     * @return bool
     */
    private static function manifestFileExists()
    {
        $manifestPath = self::$baseAppFolder . self::$assetsFolder . '/' . 'manifest.json';

        return file_exists($manifestPath);
    }

    /**
     * Returns the base path of a asset based on it's type.
     *
     * @param string $type The type of asset. Needs to be a valid one
     *
     * @return string the found base path or empty string
     */
    private static function getAssetPathByType($type)
    {
        $result = '';
        if (in_array($type, self::$validAssetTypes)) {
            switch ($type) {
                case 'script':
                    $result = self::$scriptsFolder;
                    break;
                case 'style':
                    $result = self::$stylesFolder;
                    break;
                case 'image':
                    $result = self::$imagesFolder;
                    break;
                case 'font':
                    $result = self::$fontsFolder;
                    break;
                default:
                    break;
            }
        } else {
            throw new \UnexpectedValueException("Invalid asset type \"${type}\".");
        }

        return $result;
    }

    /**
     * Initializing the manifest file for the production assets.
     * @throws ManifestFileNotFoundException
     */
    private static function initManifestFile()
    {
        if (self::manifestFileExists()) {
            self::$manifestFileContent = json_decode(
                file_get_contents(
                    self::$baseAppFolder . self::$assetsFolder . '/' . 'manifest.json'
                ),
                true
            );
        } else {
            throw new ManifestFileNotFoundException();
        }
    }

    /**
     * Get the app environment: development or production
     * @return string
     */
    private function appEnv()
    {
        return getenv('ENV');
    }

    /**
     * Confirms if the application is in development mode.
     * @return bool
     */
    public static function isInDevelopmentMode()
    {
        return self::appEnv() !== 'production';
    }

    /**
     * Checks if the app is in production mode.
     * @return bool
     */
    public static function isInProductionMode()
    {
        return ! self::isInDevelopmentMode();
    }

    /**
     * Returns the script based on the configured path
     *
     * @param string $script The script name or path.
     *
     * @return string
     */
    public static function getScript($script)
    {
        return self::getAsset(self::getAssetPathByType('script') . '/' . $script);
    }

    /**
     * Returns the style based on the configured path
     *
     * @param string $style The script name or path.
     *
     * @return string
     */
    public static function getStyle($style)
    {
        return self::getAsset(self::getAssetPathByType('style') . '/' . $style);
    }

    /**
     * Returns the image based on the configured path
     *
     * @param string $image The script name or path.
     *
     * @return string
     */
    public static function getImage($image)
    {
        return self::getAsset(self::getAssetPathByType('image') . '/' . $image);
    }
}