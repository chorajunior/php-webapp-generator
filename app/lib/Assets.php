<?php
/**
 * User: itamarjr91@gmail.com
 * Date: 06/06/16
 * Time: 21:45
 */

namespace PHPAppGenerator;


use Dotenv\Exception\ValidationException;

class Assets
{
    // The main paths
    public static $assetsBasePaths = array();
    public static $baseAppDir;
    public static $scriptsFolder;
    public static $stylesFolder;
    public static $imagesFolder;
    public static $fontsFolder;

    // The asset types
    private static $validAssetTypes = array('script', 'style', 'image', 'font');

    public function __construct()
    {
        // Initializing the variables that point to the default folders
        self::$assetsBasePaths = array(
            'development' => getenv('ASSETS_PATH_DEVELOPMENT'),
            'production' => getenv('ASSETS_PATH_PRODUCTION'),
        );
        self::$baseAppDir = $_SERVER['DOCUMENT_ROOT'];

        self::$scriptsFolder = getenv('SCRIPTS_FOLDER');
        self::$stylesFolder = getenv('STYLES_FOLDER');
        self::$imagesFolder = getenv('IMAGES_FOLDER');
        self::$fontsFolder = getenv('FONTS_FOLDER');
    }

    /**
     * Returns the app's base dir. It is the entry point to the assets folder.
     * @return string The app base dir
     */
    protected static function getBaseAppDir()
    {
        return self::$baseAppDir;
    }

    /**
     * Returns the path of an asset it exists. Empty string, otherwise.
     * @param string $path The path to the asset
     * @return string
     */
    public static function getAsset($path)
    {
        $fullPath = self::getBaseAppDir() . $path;
        return file_exists($fullPath) ? $fullPath : '';
    }

    /**
     * Returns the base path of a asset based on it's type.
     * @param string $type The type of asset. Needs to be a valid one
     * @return string the found base path or empty string
     */
    protected static function getAssetPathByType($type) {
        if(in_array($type, self::$validAssetTypes)) {
            $currentPathEnv = self::$assetsBasePaths[getenv('ENV')];
            switch ($type) {
                case 'script':
                    return $currentPathEnv . '/' . self::$scriptsFolder;
                case 'style':
                    return $currentPathEnv . '/' . self::$stylesFolder;
                case 'image':
                    return $currentPathEnv . '/' . self::$imagesFolder;
                case 'font':
                    return $currentPathEnv . '/' . self::$fontsFolder;
                default:
                    return '';
            }
        } else {
            throw new \UnexpectedValueException("Invalid asset type \"${type}\".");
        }
    }

    /**
     * Returns the script based on the configured path
     * @param string $script The script name or path.
     * @return string
     */
    public static function getScript($script)
    {
        return self::getAsset(self::getAssetPathByType('script') . '/' . $script);
    }

    /**
     * Returns the style based on the configured path
     * @param string $style The script name or path.
     * @return string
     */
    public static function getStyle($style)
    {
        return self::getAsset(self::getAssetPathByType('style') . '/' . $style);
    }

    /**
     * Returns the image based on the configured path
     * @param string $image The script name or path.
     * @return string
     */
    public static function getImage($image)
    {
        return self::getAsset(self::getAssetPathByType('image') . '/' . $image);
    }
}