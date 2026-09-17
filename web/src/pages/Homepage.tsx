import { ModulesList } from "../components/ModulesList";
import { PageLayout } from "../components/PageLayout";
import { RenderMarkdown } from "../components/Markdown";

export function Homepage() {
  return (
    <PageLayout heading={<h1>Modules</h1>}>
      <ModulesList />
      {
        import.meta.env.DEV && (
          <RenderMarkdown content={exampleMarkdown} />   
        )
      }
    </PageLayout>
  )
}

const exampleMarkdown = `
# Lesson example

This is inline math: $3 + 4 = 7$.

- First item
- Second item

| Name | Value |
| --- | ---: |
| Apples | 3 |
| Oranges | 4 |

\`\`\`js
const total = 3 + 4;
\`\`\`

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

<script>alert("Not executed")</script>

# Math Blasters

Learn basic math through short tutorials and open-ended labs.

## How to use Math Blasters

1. Click on a topic
2. Click on a lesson
3. Click on a tutorial or lab
4. Solve the exercises

## Topics

- Arithmetic
- Algebra
- Geometry

## Credits

- [freeCodeCamp](https://www.freecodecamp.org/learn/)
- [freeCodeCamp-Summer-Cohort-2026](https://github.com/freeCodeCamp-Summer-Cohort-2026)

## License

[MIT](./LICENSE)

`;