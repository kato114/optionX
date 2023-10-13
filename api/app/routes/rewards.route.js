import { Router } from "express";

import * as rewards from "../controllers/rewards.controller.js";

export const rewardsRouter = (app) => {
  const router = Router();
  router.get("/analysis", rewards.analysis);
  router.get("/history/:address", rewards.history);
  router.get("/claimed/:address", rewards.claimed);
  router.get("/statistic/:address", rewards.statistic);

  router.post("/process", rewards.process);
  router.post("/calculate", rewards.calculate);
  router.post("/request/:address", rewards.request);
  router.post("/referral/:tgId/:address", rewards.referral);

  app.use("/api/rewards", router);
};
