
import React, { useEffect } from "react";
import str from "/demos/d3/index.mdx/data/str";
import LivePreviewer from "@mddoc/default-theme/live-previewer";

export const $$_key = "-demos-d3-index-mdx-d-1";

export default () => (
    <LivePreviewer 
        infos={{"className":["language-tsx"],"metastring":"live","live":true}}
        scopes={{useEffect: useEffect, str: str}}
        _key="-demos-d3-index-mdx-d-1"
    >
        <pre>{`const App = (props: {
    str: string;
}) => {
    useEffect(() => {
        console.log('yo yo yo!~');
    }, []);
    return <div>
    <h1>code preivew: {props.str}</h1>
  </div>;
};
render(<App str={str}/>);
`}</pre>
    </LivePreviewer>
)
