export interface IImportInfo {
    '*': string,
    defaultProperty: string;
    properties: {[k:string]:string};
    moduleName:string;
    moduleScopeName:string;
    origin:string;
}

export interface IOptions {
    /** 工作目录 */
    workingDir?: string;
    /** 当前 mdx 文件的路径 */
    curFilePath: string;
    /** 临时路径，存放 demo 的地方 */
    tempDir:string;
    viewRelative:boolean;
    fileconfig: {
        pure?:boolean;
        [k:string]:any;
    };
    LiveComponent: {
        name:string;
        path:string;
    };
    DisplayComponent: {
        name:string;
        path:string;
    };
}