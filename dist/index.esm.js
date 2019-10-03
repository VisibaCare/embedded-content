var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["Ios"] = 0] = "Ios";
    DeviceType[DeviceType["Android"] = 1] = "Android";
    DeviceType[DeviceType["Web"] = 2] = "Web";
})(DeviceType || (DeviceType = {}));
var VisibaEmbeddedWebHelper = /** @class */ (function () {
    function VisibaEmbeddedWebHelper() {
        this.setupInternalUrlListener();
    }
    /**
     * @description Submit data to Visiba Care service.
     * @param data { Type: string; Origin: string; Data: any; }[]
     */
    VisibaEmbeddedWebHelper.prototype.submitData = function (data) {
        var _this = this;
        if (!data.length)
            throw new Error("received empty array");
        data.forEach(function (object) {
            var validationResult = _this.objectIsValid(object);
            if (!validationResult.valid)
                throw new Error(validationResult.reason);
        });
        var emittedData = { event: "externalData", data: data };
        switch (this.getPlatform()) {
            case DeviceType.Ios:
                window.webkit.messageHandlers["visibaEmbeddedWebData"].postMessage(emittedData);
                break;
            case DeviceType.Android:
                prompt("JSInterface|" + JSON.stringify(emittedData), "");
                break;
            case DeviceType.Web:
                window.top.postMessage(emittedData, "*");
                break;
        }
    };
    /**
     * @description Used to programmatically return to Visiba Care
     * @param visibaCareUrl Valid Visiba Care URL
     */
    VisibaEmbeddedWebHelper.prototype.returnToVisibaCare = function (visibaCareUrl) {
        if (visibaCareUrl === void 0) { visibaCareUrl = null; }
        if (this.getPlatform() === DeviceType.Web) {
            window.top.postMessage({ event: "exitIframe", data: visibaCareUrl }, "*");
        }
        else {
            window.location.href = visibaCareUrl;
        }
    };
    /**
     * @internal
     */
    VisibaEmbeddedWebHelper.prototype.setupInternalUrlListener = function () {
        var _this = this;
        if (this.getPlatform() !== DeviceType.Web)
            return;
        window.addEventListener("beforeunload", function () {
            var navigatedUrl = document.activeElement.href;
            // TODO: validate that url is origin form querystring
            // if (navigatedUrl)
            _this.returnToVisibaCare(navigatedUrl);
        });
    };
    /**
     * @internal
     */
    VisibaEmbeddedWebHelper.prototype.getPlatform = function () {
        var userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            return DeviceType.Android;
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return DeviceType.Ios;
        }
        return DeviceType.Web;
    };
    /**
     * @internal
     */
    VisibaEmbeddedWebHelper.prototype.objectIsValid = function (object) {
        if (!object || !Object.keys(object).length)
            return { valid: false, reason: "object not defined" };
        if (!object.Type || !["keyvalue"].includes(object.Type))
            return {
                valid: false,
                reason: "property Type required. Should be a valid type"
            };
        if (!object.Origin || typeof object.Origin !== "string")
            return { valid: false, reason: "property Origin required. Type: string" };
        if (!object.Data)
            return { valid: false, reason: "property Data required" };
        if (Object.keys(object).length !== 3)
            return {
                valid: false,
                reason: "too many properties (allowed: Type, Origin, Data)"
            };
        return { valid: true, reason: "" };
    };
    return VisibaEmbeddedWebHelper;
}());
var embeddedWebHelper = new VisibaEmbeddedWebHelper();
window["visiba"] = window["visiba"] || {};
window.visiba.embeddedWebHelper = embeddedWebHelper;

export { embeddedWebHelper };
