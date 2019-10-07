interface EmbeddedWebItem {
  Type: "NameValue";
  Origin: string;
  Data: any;
}

enum DeviceType {
  Ios,
  Android,
  Web
}

class VisibaEmbeddedWebHelper {
  constructor() {
    this.setupInternalUrlListener();
  }

  /**
   * @description Submit data to Visiba Care service.
   * @param data { Type: string; Origin: string; Data: any; }[]
   */
  public submitData(data: EmbeddedWebItem[]) {
    if (!data.length) throw new Error("received empty array");
    data.forEach(object => {
      const validationResult = this.objectIsValid(object);
      if (!validationResult.valid) throw new Error(validationResult.reason);
    });

    const emittedData = { event: "externalData", data: data };

    switch (this.getPlatform()) {
      case DeviceType.Ios:
        (window as any).webkit.messageHandlers[
          "visibaEmbeddedWebData"
        ].postMessage(emittedData);
        break;
      case DeviceType.Android:
        prompt(`JSInterface|${JSON.stringify(emittedData)}`, "");
        break;
      case DeviceType.Web:
        window.top.postMessage(emittedData, "*");
        break;
    }
  }

  /**
   * @description Used to programmatically return to Visiba Care
   * @param visibaCareUrl Valid Visiba Care URL
   */
  public returnToVisibaCare(visibaCareUrl: string) {
    if (this.getPlatform() === DeviceType.Web) {
      window.top.postMessage({ event: "exitIframe", data: visibaCareUrl }, "*");
    } else {
      window.location.href = visibaCareUrl;
    }
  }

  /**
   * @internal
   */
  private setupInternalUrlListener() {
    if (this.getPlatform() !== DeviceType.Web) return;

    window.addEventListener("beforeunload", () => {
      const navigatedUrl = (document.activeElement as HTMLLinkElement).href;
      // TODO: validate that url is origin form querystring
      // if (navigatedUrl)
      this.returnToVisibaCare(navigatedUrl);
    });
  }

  /**
   * @internal
   */
  private getPlatform() {
    var userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      return DeviceType.Android;
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return DeviceType.Ios;
    }
    return DeviceType.Web;
  }

  /**
   * @internal
   */
  private objectIsValid(object: any) {
    if (!object || !Object.keys(object).length)
      return { valid: false, reason: "object not defined" };

    if (!object.Type || !["NameValue"].includes(object.Type))
      return {
        valid: false,
        reason: "property Type required. Should be a valid type"
      };

    if (!object.Origin || typeof object.Origin !== "string")
      return { valid: false, reason: "property Origin required. Type: string" };

    if (!object.Data) return { valid: false, reason: "property Data required" };

    if (Object.keys(object).length !== 3)
      return {
        valid: false,
        reason: "too many properties (allowed: Type, Origin, Data)"
      };

    return { valid: true, reason: "" };
  }
}

const embeddedWebHelper = new VisibaEmbeddedWebHelper();

window["visiba"] = window["visiba"] || {};
(window as any).visiba.embeddedWebHelper = embeddedWebHelper;
export { embeddedWebHelper };
