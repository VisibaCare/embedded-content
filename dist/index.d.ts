interface EmbeddedWebItem {
    Type: "keyvalue";
    Origin: string;
    Data: any;
}
declare class VisibaEmbeddedWebHelper {
    constructor();
    /**
     * @description Submit data to Visiba Care service.
     * @param data { Type: string; Origin: string; Data: any; }[]
     */
    submitData(data: EmbeddedWebItem[]): void;
    /**
     * @description Used to programmatically return to Visiba Care
     * @param visibaCareUrl Valid Visiba Care URL
     */
    returnToVisibaCare(visibaCareUrl?: string | null): void;
}
declare const embeddedWebHelper: VisibaEmbeddedWebHelper;
export { embeddedWebHelper };
