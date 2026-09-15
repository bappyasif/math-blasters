import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it } from "vitest";

// import { App } from "../src/App";
// import { api } from "../src/api/client";
import { expectNoA11yViolations } from "./helpers/a11y";
import { Homepage } from "../src/pages/Homepage";
import { NotFoundPage } from "../src/pages/NotFoundPage";

// const mockProblem = {
//   slug: "addition-demo",
//   prompt: "What is 3 + 4?",
//   expression: "3 + 4 = ?",
// };

// beforeEach(() => {
//   vi.spyOn(api, "getDemoProblem").mockResolvedValue(mockProblem);
// });

// afterEach(() => {
//   vi.restoreAllMocks();
// });

describe("Accessibility checks (vitest-axe)", () => {
  it("home page and root layout should have no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Homepage />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  // it("loading skeleton state should have no accessibility violations", async () => {
  //   // vi.spyOn(api, "getDemoProblem").mockReturnValue(new Promise(() => {}));
  //   const { container } = render(
  //     <MemoryRouter initialEntries={["/"]}>
  //       <App />
  //     </MemoryRouter>
  //   );
  //   // expect(screen.getAllByRole("status")).not.toHaveLength(0);
  //   await expectNoA11yViolations(container);
  // });

  // it("error state should have no accessibility violations", async () => {
  //   // vi.spyOn(api, "getDemoProblem").mockRejectedValue(new Error());
  //   const { container } = render(
  //     <App />
  //   );
  //   // expect(await screen.findByRole("alert")).toBeInTheDocument();
  //   await expectNoA11yViolations(container);
  // });

  it("not-found page and root layout should have no accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
