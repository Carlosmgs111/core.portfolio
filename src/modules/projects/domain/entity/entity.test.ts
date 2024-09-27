import { Project } from "./";

describe("Lifecycle of project entity", () => {
  test("Create a new project", () => {
    const project = new Project({
      uuid: "0",
      name: "Test Project",
      descriptions: ["A test project"],
      images: ["https://images.com"],
      tags: ["lorem", "ipsum"],
      uri: "https://test.project.com",
      version: "0.1.2",
    });

    expect(project.uuid).toBe("0");
    expect(project.name).toBe("Test Project");
    expect(project.descriptions).toContain("A test project");
    expect(project.uri).toBe("https://test.project.com");
    expect(project.version).toBe("0.1.2");
  });
});

describe("Project repository services", () => {
  test("Create a new project", () => {});
});
