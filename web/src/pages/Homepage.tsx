import { ModulesList } from "../components/ModulesList";
import { PageLayout } from "../components/PageLayout";
import { RenderMarkdown } from "../components/Markdown";

export function Homepage() {
  return (
    <PageLayout heading={<h1>Modules</h1>}>
      <ModulesList />
      {
        import.meta.env.DEV && (
          <RenderMarkdown />   
        )
      }
    </PageLayout>
  )
}
