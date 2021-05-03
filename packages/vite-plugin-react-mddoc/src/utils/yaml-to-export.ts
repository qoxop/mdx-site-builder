import yaml from 'yaml';

const gsrc = ({name, code}, other) => `

export const ${name} = ${code};

${other}
`

export default function (codeSrc:string, exportName:string) {
    const reg = /^---\n(.*\n)+---/;
    const yamlMatchArray = codeSrc.match(reg);
    if (yamlMatchArray) {
        // 删除 yaml 字符串
        codeSrc = Buffer.from(codeSrc.replace(yamlMatchArray[0], '')).toString();
        // 提取 yamlText
        const yamlText = yamlMatchArray[0].replace(/---/g, '');
        try {
            // 解析 yaml
            const yamlData = yaml.parse(yamlText);
            return {
                src: gsrc({name: exportName, code: JSON.stringify(yamlData)}, codeSrc),
                config: yamlData
            }
        } catch (error) {
            return { src: codeSrc, config: {} };
        }
    }
    return { src: codeSrc, config: {} };
}