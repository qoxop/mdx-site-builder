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
    /** 当前 mdx 文件的路径(基于工作目录) */
    curFilePath: string;
    /** 存放 demo 的路径(基于工作目录) */
    demopath:string;
    /** 是否展示相对路径代码 */
    viewRelative?:boolean;
    /** 文件头部的yaml配置 */
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