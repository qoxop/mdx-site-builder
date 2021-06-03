/* @jsxRuntime classic */
/* @jsx mdx */

export const config = {
  "pure": true,
  "filepath": "/Users/qoxop/development/mynpm/mdx-site-builder/packages/rehype-code-demo/__tests__/demos/d1/index.mdx"
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

    <h3></h3>
    <p>{`纯文档页面`}</p>
    <p>{`😋啦啦啦啦，`}</p>
    <blockquote>
      <p parentName="blockquote">{`yo yo yo ~~~`}</p>
    </blockquote>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;