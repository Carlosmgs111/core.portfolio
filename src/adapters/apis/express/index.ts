
export const expressHandlerAdapter = (adapter: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      return res.send(await adapter(req.body));
    } catch (e: any) {
      next(e)
    }
  };
};
