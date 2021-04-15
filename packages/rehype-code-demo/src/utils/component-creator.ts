export const live = (p: {
    name: string,
    path: string,
    importCode: string,
    code: string,
    properties?:{[k: string]: any};
    scopes: {[k:string]:string};
    key: string;
}) => (`
${p.importCode}
import ${p.name} from "${p.path}";

export const $$_key = "${p.key}";

export default () => (
    <${p.name} 
        infos={${JSON.stringify(p.properties)}}
        scopes={{${Object.keys(p.scopes).map(k => `${k}: ${p.scopes[k]}`).join(', ')}}}
    >
        <pre>{\`${p.code}\`}</pre>
    </${p.name}>
)
`)

export const preview = (p: {
    importCode: string;
    key:string;
    mainCode:string;
}) => (`
${p.importCode}

export const $$_key = "${p.key}";

${p.mainCode}

`)

export const codeDisplay = (p: {
    name:string;
    demoCompName:string;
    isLive:boolean;
    properties:{[k:string]:string};
    key:string;
    codes: {code:string, language:string, type: 'main'|'minor', filename?:string}[]
}) => (`
<${p.name} 
    component={${p.demoCompName}}
    id="${p.key}"
    live={${p.isLive}}
    properties={${JSON.stringify(p.properties)}}
>
    ${p.codes.map(item => `<pre filename="${item.filename}" type="${item.type}" language="${item.language}">{\`${item.code.replace('`', '\`')}\`}</pre>`).join('\n')}
</${p.name}>
`)