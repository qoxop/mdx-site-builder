/* @jsxRuntime classic */
/* @jsx mdx */
import MDX_Demo_1 from "/_demos/-demos-d3-index-mdx-d-1.demo.jsx";
import CodesDisplay from '@qoxop/default-theme/codes-display';
export const config = {
  "author": "q",
  "tags": "code,mdx"
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

    <CodesDisplay component={MDX_Demo_1} id="-demos-d3-index-mdx-d-1" live={true} properties={{
      "className": ["language-jsx"],
      "metastring": "live",
      "live": true
    }} mdxType="CodesDisplay">
    <pre filename="undefined" type="main" language="tsx">{`/* import React, { useEffect } from 'react'; */() => {
    useEffect(() => {
        console.log('yo yo yo~');
    }, []);
    return <div>
    <h1>code preivew </h1>
  </div>;
};
`}</pre>
    </CodesDisplay>

    <blockquote>
      <p parentName="blockquote">{`other info 😋`}</p>
    </blockquote>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;