import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { screen } from "@testing-library/dom";

import { App } from "../src/App";

describe("App Layout Root", () => {
  it("renders the real homepage components on startup", async () => {
    render(<App />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    expect(await screen.findByText("Modules")).toBeInTheDocument();
  });
});
