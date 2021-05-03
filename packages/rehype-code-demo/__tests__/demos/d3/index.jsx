/* @jsxRuntime classic */
/* @jsx mdx */

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
    <pre><code parentName="pre" {...{
        "className": "language-tsx",
        "metastring": "live",
        "live": true
      }}>{`import React, { useEffect } from 'react';
import str from './data/str';

conat App = (props: {str: string}) => {
  useEffect(() => {
    console.log('yo yo yo!~');
  }, []);
  return <div>
    <h1>code preivew: {props.str}</h1>
  </div>
}
render(<App str={str} />);
`}</code></pre>
    <blockquote>
      <p parentName="blockquote">{`other info 😋`}</p>
    </blockquote>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;