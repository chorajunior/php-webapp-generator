module.exports = function (manifest) {
    return {
        getAssetPath: function (forAssetType) {
            var pathForAssetType = "";

            switch (forAssetType) {
                case "styles":
                    pathForAssetType = manifest.paths.styles;
                    break;
                case "scripts":
                    pathForAssetType = manifest.paths.scripts;
                    break;
                case "images":
                    pathForAssetType = manifest.paths.images;
                    break;
                case "fonts":
                    pathForAssetType = manifest.paths.fonts;
                    break;
                default:
                    break;
            }
            return pathForAssetType;
        },
        getBuildPath: function (forAssetType) {
            return manifest.paths.publicDir + '/' + manifest.paths.dist + '/' + manifest.paths.build + '/' + this.getAssetPath(forAssetType);
        },
        getDistPath: function (forAssetType) {
            return manifest.paths.publicDir + '/' + manifest.paths.dist + '/' + this.getAssetPath(forAssetType);
        },
        getSourcePath: function (forAssetType) {
            return manifest.paths.appDir + '/' + manifest.paths.source + '/' + this.getAssetPath(forAssetType);
        }
    };
};