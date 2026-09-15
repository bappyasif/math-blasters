import { getModules } from "../content"
import { Card } from "./Card";
import { PageLayout } from "./PageLayout";

export const ModulesList = () => {
    const modules = getModules();

    return (
        modules?.length ? (
            <PageLayout heading={<h1>Modules</h1>}>
                {modules.map((module) => (
                    <a
                        key={module.slug}
                        href={`/modules/${encodeURIComponent(module.slug)}`}
                        className="module-card-link"
                    >
                        <Card title={module.title} titleLevel="h2" className="module-card">
                            <p className="module-card-description">{module.description}</p>
                            <span className="module-card-lessons">{module.lessons.length} lessons</span>
                        </Card>
                    </a>
                ))}
            </PageLayout>
        ) : (
            <div className="empty-state">
                <p>No modules found.</p>
                <a href="https://github.com/freeCodeCamp-Summer-Cohort-2026/math-blasters/blob/main/CONTRIBUTING.md#adding-a-lesson">
                    Learn how to add a lesson
                </a>
            </div>
        )
    )
}