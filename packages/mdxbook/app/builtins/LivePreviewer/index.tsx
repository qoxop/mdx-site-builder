import React, { JSXElementConstructor, ReactElement, useMemo, useState } from 'react';
import github from 'prism-react-renderer/themes/github';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import './index.css';

function jsCopy(text:string, onSuccess?: (text:string) => void, onError?: (err:string) => void) {
    if (typeof document.execCommand === 'function') { 
        const id = 'input-element-for-copy';
        let input:HTMLInputElement = document.getElementById(id) as HTMLInputElement;
        if (!input) {
            input = document.createElement('input');
            input.id = id;
            input.style.height = '1px';
            input.style.width = '1px';
            input.style.position = 'fixed';
            input.style.top = '-800px';
            input.style.left = '-800px';
            document.body.appendChild(input);
        }
        input.value = text;
        input.innerText = text;
        input.select();
        setTimeout(() => {
            document.execCommand('Copy');
            input.blur();
            onSuccess && onSuccess(text)
        })
    } else if (typeof onError === 'function') {
        onError && onError('不支持复制~~')
    }
}

/**
 * https://github.com/FormidableLabs/react-live
 */
interface IProps {
    scope: {[k:string]:any};
    noInline?: boolean;
    infos?: {
        title?:string;
        desc?:string;
        [k:string]:string|undefined;
    },
    children: ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]
}
const HighlightRender = (props: {code:string, language:Language, theme:any}) => {
    const {code, language, theme} = props;
    return (
        <Highlight {...defaultProps} code={code} theme={theme} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                        ))}
                    </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
}

const transformCode = (snippet: string) => {
    // @ts-ignore
    return window.ts.transpile(snippet, {
        noImplicitUseStrict: true,
        target: 'es6',
        jsx: 'react'
      });
}

export default function LiveCode(props:IProps) {
    const {
        scope,
        noInline,
        infos = {},
        children,
    } = props;
    const [show, toggle] = useState(false);
    const [tab, setTab] = useState('main');
    const {codes, mainCode} = useMemo(() => {
        const codes:{type:string, language:string, filename:string, code:string}[] = [];
        let mainCode:string = '';
        React.Children.forEach(children, (item: React.ReactElement) => {
            const {type, language, filename} = item.props;
            if (type === 'editor') {
                mainCode = String(item.props.children);
            } else if (!!type && !!language) {
                console.log(item.props.children)
                codes.push({type, language, filename, code: String(item.props.children)})
            }
        })
        return {codes, mainCode}
    }, [children]);
    const [code, setCode] = useState(mainCode);
    return (
        <LiveProvider scope={scope} language="jsx" noInline={noInline} transformCode={transformCode} code={code} theme={github}>
            <div className="aw-live-code-box">
                <div className="aw-live-code-preview">
                    <LivePreview />
                </div>
                {!!(infos.title || infos.desc) && <div className="aw-live-code-info-box" title={infos.title}>
                    <p>{infos.desc}</p>
                </div>}
                <div className="aw-live-code-actions-bar">
                    <div className="aw-live-code-action" onClick={() => jsCopy(mainCode)}>copy</div>
                    <div className="mlr4">|</div>
                    <div className="aw-live-code-action" onClick={() => toggle((s:boolean) => !s)}>{show ? 'hide' : 'show'}</div>
                </div>
                {(!!show && codes.length === 0) && <LiveEditor onChange={(code: string) => setCode(code)} />}

                {(!!show && !!codes.length) && (<div className="aw-live-code-tab-wrapper">
                    <div className="aw-live-code-tab-bar">
                        <div
                            className={'main' === tab ? 'aw-live-code-tab-select' : 'aw-live-code-tab-unselect'}
                            onClick={() => setTab('main')}
                        >
                            <span>main</span>
                        </div>
                        <>
                            {codes.map(v => (<div
                                key={v.filename}
                                className={v.filename === tab ? 'aw-live-code-tab-select' : 'aw-live-code-tab-unselect'}
                                onClick={() => setTab(v.filename)}
                            >
                                <span>{v.filename}</span>
                            </div>))}
                        </>
                    </div>
                    <div className={'main' === tab ? 'aw-lc-tab-block-select' : 'aw-lc-tab-block-unselect'}>
                        <LiveEditor />
                    </div>
                    {codes.map(t => <div key={t.filename} className={t.filename === tab ? 'aw-lc-tab-block-select' : 'aw-lc-tab-block-unselect'}>
                        <HighlightRender code={t.code} language={t.language as Language} theme={github} />
                    </div>)}
                </div>)}
                
                <div>
                    <LiveError />
                </div>
            </div>
            {/* <StyteComponent /> */}
        </LiveProvider>
    );
}
