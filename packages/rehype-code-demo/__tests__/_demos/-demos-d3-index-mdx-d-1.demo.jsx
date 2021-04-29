
import React, { useEffect } from "react";
import LivePreviewer from "@qoxop/default-theme/live-previewer";

export const $$_key = "-demos-d3-index-mdx-d-1";

export default () => (
    <LivePreviewer 
        infos={{"className":["language-jsx"],"metastring":"live","live":true}}
        scopes={{}}
    >
        <pre>{`() => {
    useEffect(() => {
        console.log('yo yo yo~');
    }, []);
    return <div>
    <h1>code preivew </h1>
  </div>;
};
`}</pre>
    </LivePreviewer>
)
