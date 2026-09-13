import { getModules } from "../content"

export const ModulesList = () => {
    const modules = getModules();

    return (
        modules?.length ? (
            <div className="modules-list">
                {modules.map((module) => (
                    <a 
                        key={module.slug} 
                        href={`/modules/${module.slug}`}
                        className="module-card-link"
                    >
                        {/* will replace it with "CARD" when ready */}
                        <div>
                            <h3>{module.title}</h3>
                            <p>{module.description}</p>
                            <span>{module.lessons.length} lessons</span>
                        </div>
                    </a>
                ))}
            </div>
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