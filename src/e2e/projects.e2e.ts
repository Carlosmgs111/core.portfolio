import { spyFind } from "../__mocks__/DatabaseServiceStub";
import request from "supertest";
import { app } from "../infrastructure/apis/express";

describe("Test for get all projects endpoint", () => {
  let server: any = null;
  beforeAll(() => {
    server = app.listen(4040, () =>
      console.log("Test server running at port 4040")
    );
  });
  afterAll(() => {
    server.close();
  });
  describe("test for get all projects", () => {
    test("should return a list", async () => {
      const { body } = await request(app)
        .get("/api/projects/projects")
        .expect(200);

      console.log({ body });
      expect.arrayContaining(body);
      expect(spyFind).toHaveBeenCalled();
    });
  });
});
