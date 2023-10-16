export const TaskMessageStub = {};

export default jest.mock("../../config/dependencies", () => {
  // jest.fn().mockImplementation(() => TaskMessageStub)
  return {
    __esModule: true,
    TaskMessageService: TaskMessageStub,
  };
});
