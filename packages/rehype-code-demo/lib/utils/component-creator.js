"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.codeDisplay = exports.preview = exports.live = void 0;

const live = p => `
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
`;

exports.live = live;

const preview = p => `
${p.importCode}

export const $$_key = "${p.key}";

${p.mainCode}

`;

exports.preview = preview;

const codeDisplay = p => `
<${p.name} 
    component={${p.demoCompName}}
    id="${p.key}"
    live={${p.isLive}}
    properties={${JSON.stringify(p.properties)}}
>
    ${p.codes.map(item => `<pre filename="${item.filename}" type="${item.type}" language="${item.language}">{\`${item.code.replace('`', '\`')}\`}</pre>`).join('\n')}
</${p.name}>
`;

exports.codeDisplay = codeDisplay;