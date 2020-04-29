import { Router } from "express";
import { router as userRouter } from "../../modules/user/user.routes";
import { router as noteRouter } from "../../modules/note/note.routes";

const router = Router();
router.use("/users", userRouter);
router.use("/notes", noteRouter);

export default router;
