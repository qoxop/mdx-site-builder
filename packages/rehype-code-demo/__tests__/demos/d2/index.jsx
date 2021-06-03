/* @jsxRuntime classic */
/* @jsx mdx */
import MDX_Demo_1 from "/_demos/-demos-d2-index-mdx-d-1.demo.jsx";
import CodesDisplay from '@mddoc/default-theme/codes-display';
export const config = {
  "author": "q",
  "tags": "code,mdx",
  "filepath": "/Users/qoxop/development/mynpm/mdx-site-builder/packages/rehype-code-demo/__tests__/demos/d2/index.mdx"
};

const layoutProps = {
  config
};
const MDXLayout = "wrapper"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">

    <h3>{`code preview`}</h3>

    <CodesDisplay component={MDX_Demo_1} id="-demos-d2-index-mdx-d-1" live={false} properties={{
      "className": ["language-jsx"]
    }} mdxType="CodesDisplay">
    <pre filename="undefined" type="main" language="tsx">{`import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    console.log('yo yo yo~')
  }, [])
  return <div>
    <h1>code preivew </h1>
  </div>
}
`}</pre>
    </CodesDisplay>

    <blockquote>
      <p parentName="blockquote">{`other info 😋`}</p>
    </blockquote>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;