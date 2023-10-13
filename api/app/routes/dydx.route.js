import { Router } from "express";

import * as dydx from "../controllers/dydx.controller.js";

export const dydxRouter = (app) => {
  const router = Router();
  router.get("/markets", dydx.markets);
  router.get("/lplist", dydx.lplist);

  app.use("/api/dydx", router);
};
