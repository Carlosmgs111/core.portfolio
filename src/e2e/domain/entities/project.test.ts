import { Project } from "../../../domain/entities/Project";

describe("Lifecycle of project entity",()=>{test("Create a new project", () => {
  const project = new Project({
    uuid: "0",
    name: "Test Project",
    description: "A test project",
    uri: "https://test.project.com",
    version: "0.1.2",
  });

  expect(project.uuid).toBe("0");
  expect(project.name).toBe("Test Project");
  expect(project.description).toBe("A test project");
  expect(project.uri).toBe("https://test.project.com");
  expect(project.version).toBe("0.1.2"); 
});})


describe("Project repository services",()=>{
  test("Create a new project",()=>{

  })
})