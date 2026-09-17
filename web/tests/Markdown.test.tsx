import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RenderMarkdown } from "../src/components/Markdown";

describe("Markdown tests", () => {
    it("redners a h1 heading", () => {
        render(<RenderMarkdown content="# Heading" />);
        expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeInTheDocument();
    });

    it("redners a h2 heading", () => {
        render(<RenderMarkdown content="## Heading" />);
        expect(screen.getByRole("heading", { level: 2, name: "Heading" })).toBeInTheDocument();
    });

    it("renders inline math with KaTeX", () => {
        const { container } = render(
            <RenderMarkdown content="$3 + 4 = 7$" />,
        );

        expect(container.querySelector(".katex")).toBeInTheDocument();
        expect(container.querySelector(".katex-mathml")).toBeInTheDocument();
    });

    it("renders a code block", () => {
        render(
            <RenderMarkdown content={"```js\nconst foo = 'bar';\n```"} />,
        );

        expect(screen.getByText("const foo = 'bar';")).toBeInTheDocument();
    });

    it("does not render raw scripts", () => {
        render(<RenderMarkdown content="<script>alert('hi')</script>" />);
        expect(screen.queryByText("alert('hi')")).not.toBeInTheDocument();
    });
});
