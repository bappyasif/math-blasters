import { Link } from "react-router-dom";
import { getModules } from "../content"
import { Card } from "./Card";
import { PageLayout } from "./PageLayout";

export const ModulesList = () => {
    const modules = getModules();

    return (
        <PageLayout heading={<h2>Modules</h2>}>
            {
                modules?.length ? (
                    modules.map((module) => (
                        <Link
                            key={module.slug}
                            to={`/modules/${encodeURIComponent(module.slug)}`}
                            className="module-card-link"
                        >
                            <Card title={module.title} titleLevel="h3" className="module-card">
                                <p className="module-card-description">{module.description || "No description provided"}</p>
                                <span className="module-card-lessons">{module.lessons.length} lessons</span>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <Card title="No modules found." titleLevel="h3" className="empty-state">
                        <a target="_blank" href="https://github.com/freeCodeCamp-Summer-Cohort-2026/math-blasters/blob/main/CONTRIBUTING.md#adding-a-lesson">
                            Learn how to add a lesson
                        </a>
                    </Card>
                )
            }
        </PageLayout>
    )
}