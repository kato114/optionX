import { Router } from "express";

import * as account from "../controllers/account.controller.js";

export const accountRouter = (app) => {
  const router = Router();
  router.post("/create/:tg_id", account.create);
  router.get("/user/:tg_id", account.user);
  router.post("/deposit/:tg_id", account.deposit);
  router.post("/withdraw/:tg_id", account.withdraw);

  app.use("/api/account", router);
};
