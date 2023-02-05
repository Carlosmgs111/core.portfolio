export const expressHandlerAdapter = (handler: any) => {
  return async (req: any, res: any, next: any) => {
    const { body, params, query, user, token } = req;
    console.log({ body, params, query });
    try {
      return res.send(
        await handler({ ...body, ...params, ...query, user, token })
      );
    } catch (e: any) {
      next(e);
    }
  };
};
