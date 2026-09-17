import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { Homepage } from "./pages/Homepage";
import { NotFoundPage } from "./pages/NotFoundPage";
import FeedbackStyleGuideView from "./pages/FeedbackStyleGuideView";
import MarkdownStyleGuideView from "./pages/MarkdownStyleGuideView";

/**
 * Route declaration for the app.
 */

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="/dev-only-feedback-styleguide" element={import.meta.env.DEV ? <FeedbackStyleGuideView /> : <NotFoundPage />} />
        <Route path="/dev-only-markdown-styleguide" element={import.meta.env.DEV ? <MarkdownStyleGuideView /> : <NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
