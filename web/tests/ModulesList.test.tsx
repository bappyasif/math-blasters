import { render, screen } from "@testing-library/react";
import { ModulesList } from "../src/components/ModulesList";
import * as content from '../src/content';
import { expectNoA11yViolations } from "./helpers/a11y";
import { Homepage } from "../src/pages/Homepage";
import { MemoryRouter } from "react-router-dom";

describe("ModulesList checks", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("test list view", () => {
        const { container } = render(<ModulesList />);
        expect(container).toBeInTheDocument();
    })

    it("test empty state", () => {
        // Mock getModules to return an empty array
        vi.spyOn(content, 'getModules').mockReturnValue([]);

        render(<ModulesList />);
        expect(screen.getByText("No modules found.")).toBeInTheDocument();
    })

    it("check a11y on list view", async () => {
        const { container } = render(
            <MemoryRouter>
                <Homepage />
            </MemoryRouter>
        );
        await expectNoA11yViolations(container);
    })
})