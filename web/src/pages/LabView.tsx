import { PageLesson } from "../content";
import { Card } from "../components/Card";
import { LessonStepper } from "../components/LessonStepper";

export default function LabView({ lab }: { lab: PageLesson }) {
    return (
        <Card as="section" title={lab.outcome} titleLevel="h1" titleVariant="heading" className="outcome">
            <LessonStepper lesson={lab} headingLevel="h2" />
        </Card>
    );
};
