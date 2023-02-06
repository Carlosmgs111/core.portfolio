export const expressHandlerAdapter = (handler: any) => {
  return async (req: any, res: any, next: any) => {
    const { body, params, query, user, token } = req;
    try {
      return res.send(
        await handler({ ...body, ...params, ...query, user, token })
      );
    } catch (e: any) {
      next(e);
    }
  };
};
