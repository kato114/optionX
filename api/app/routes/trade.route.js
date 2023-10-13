import { Router } from "express";

import * as trade from "../controllers/trade.controller.js";

export const tradeRouter = (app) => {
  const router = Router();
  router.get("/order/:tg_id", trade.getOrder);
  router.post("/order/:tg_id", trade.openOrder);
  router.delete("/order/:tg_id/:order_id", trade.cancelOrder);
  router.post("/closepos/:tg_id", trade.closePosition);

  app.use("/api/trade", router);
};
