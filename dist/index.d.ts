interface EmbeddedWebItem {
    Type: "keyvalue";
    Origin: string;
    Data: any;
}
declare class VisibaEmbeddedWebHelper {
    /**
     * @description Submit data to Visiba Care service.
     * @param data { Type: string; Origin: string; Data: any; }[]
     */
    submitData(data: EmbeddedWebItem[]): void;
}
declare const embeddedWebHelper: VisibaEmbeddedWebHelper;
export { embeddedWebHelper };
