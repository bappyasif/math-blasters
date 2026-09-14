import { getModules } from "../content"
import { Card } from "./Card";
import { PageLayout } from "./PageLayout";

export const ModulesList = () => {
    const modules = getModules();

    return (
        modules?.length ? (
            <PageLayout heading={<h2>Modules</h2>}>
                <div className="modules-list">
                    {modules.map((module) => (
                        <a
                            key={module.slug}
                            href={`/modules/${encodeURIComponent(module.slug)}`}
                            className="module-card-link"
                        >
                            <Card>
                                <h3 className="card-title">{module.title}</h3>
                                <p className="module-card-description">{module.description}</p>
                                <span>{module.lessons.length} lessons</span>
                            </Card>
                        </a>
                    ))}
                </div>
            </PageLayout>
        ) : (
            <div className="empty-state">
                <p>No modules found.</p>
                <a href="/CONTRIBUTING.md#adding-a-lesson">
                    Learn how to add a lesson
                </a>
            </div>
        )
    )
}