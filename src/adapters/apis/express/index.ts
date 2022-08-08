export const expressHandlerAdapter = (controller: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      return res.send(await controller(req.body));
    } catch (e: any) {
      return res.status(400).send(e.message);
    }
  };
};
