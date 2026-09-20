import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "./helpers/a11y";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LessonView } from "../src/pages/LessonView";
import { describe, it, expect } from "vitest";

function renderLessonView(slug = "marbles-in-total") {
    return render(
        <MemoryRouter initialEntries={[`/lessons/${slug}`]}>
            <Routes>
                <Route path="/lessons/:slug" element={<LessonView />} />
            </Routes>
        </MemoryRouter>
    );
};

describe("LabView Route /lessons/:slug", () => {
    it("renders the lab outcome as the main heading", () => {
        renderLessonView();

        expect(
            screen.getByRole("heading", {
                level: 1,
                name: "Combine groups of marbles to find total sums in applied scenarios.",
            }),
        ).toBeInTheDocument();
    });

    it("renders no main landmark", () => {
        renderLessonView();

        expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
        expect(screen.queryByRole("main")).not.toBeInTheDocument();
    });

    it("has no accessibility violations", async () => {
        const { container } = renderLessonView();

        await expectNoA11yViolations(container);
    });
});
