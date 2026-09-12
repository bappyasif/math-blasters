import { contentIndex, getLesson, getModule, getModules } from "../src/content/accessors";
import { expectNoCriteria } from "./helpers/accessors";

describe("content accessors", () => {
    it("returns all modules", () => {
        const modules = getModules();

        expect(modules).toHaveLength(contentIndex.length);
        expect(modules[0].slug).toBe(contentIndex[0].slug);
    });

    it("returns a module by slug", () => {
        const expected = contentIndex[0];

        const result = getModule(expected.slug);

        expect(result?.slug).toBe(expected.slug);
    });

    it("returns undefined for an unknown module slug", () => {
        expect(getModule("does-not-exist")).toBeUndefined();
    });

    it("returns a lesson by slug", () => {
        const expected = contentIndex[0].lessons[0];

        const result = getLesson(expected.slug);

        expect(result?.slug).toBe(expected.slug);
    });

    it("returns undefined for an unknown lesson slug", () => {
        expect(getLesson("does-not-exist")).toBeUndefined();
    });

    it("does not expose criteria from getModules", () => {
        expectNoCriteria(getModules());
    })

    it("does not expose criteria from getLesson", () => {
        const lessonSlug = contentIndex[0].lessons[0].slug;
        expectNoCriteria(lessonSlug)
    })
});
