import { Router } from "express";

const router = Router();

router.get("/",function(req, res) {
    res.send({ message: "Hello world!!" });
});

export default router;