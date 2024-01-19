import { Request, Response, NextFunction } from "express";

const setResponseObject = (req: Request, res: Response, next: NextFunction) => {
  (req as any).responseObject = res;
  next();
};

export default setResponseObject;
