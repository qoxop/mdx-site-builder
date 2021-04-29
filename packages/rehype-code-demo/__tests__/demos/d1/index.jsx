/* @jsxRuntime classic */
/* @jsx mdx */

export const config = {
  "pure": true
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