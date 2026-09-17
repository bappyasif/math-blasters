import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

type RenderMarkdownProps = {
    content: string;
};

export function RenderMarkdown({ content }: RenderMarkdownProps) {
    return (
        <article className="markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    table: ({ children }) => (
                        <div className="markdown-table-wrapper">
                            <table>{children}</table>
                        </div>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};
