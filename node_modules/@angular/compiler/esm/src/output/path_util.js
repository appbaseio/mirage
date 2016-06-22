import { BaseException } from '../../src/facade/exceptions';
import { isPresent, RegExpWrapper } from '../../src/facade/lang';
// asset:<package-name>/<realm>/<path-to-module>
var _ASSET_URL_RE = /asset:([^\/]+)\/([^\/]+)\/(.+)/g;
/**
 * Interface that defines how import statements should be generated.
 */
export class ImportGenerator {
    static parseAssetUrl(url) { return AssetUrl.parse(url); }
}
export class AssetUrl {
    constructor(packageName, firstLevelDir, modulePath) {
        this.packageName = packageName;
        this.firstLevelDir = firstLevelDir;
        this.modulePath = modulePath;
    }
    static parse(url, allowNonMatching = true) {
        var match = RegExpWrapper.firstMatch(_ASSET_URL_RE, url);
        if (isPresent(match)) {
            return new AssetUrl(match[1], match[2], match[3]);
        }
        if (allowNonMatching) {
            return null;
        }
        throw new BaseException(`Url ${url} is not a valid asset: url`);
    }
}
//# sourceMappingURL=path_util.js.map