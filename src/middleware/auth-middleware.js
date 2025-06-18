import { logger } from "../application/logging.js";
import jwt from "jsonwebtoken";

export const authMiddleware =  (req, res, next) => {
    const auth = req.get("Authorization");

    logger.info("================================");
    logger.info(auth);
    logger.info("================================");


    if(!auth){
        res.status(401).json({
            errors : "Unauthorized"
        }).end();
    }else{
        
        const token = auth.split(" ")[1];
        const secret = process.env.JWT_SECRET;

        logger.info(token);
        logger.info(secret);

        try {
            logger.info("wkwkwkkw");
            const jwtDecode = jwt.verify(token, secret);
                logger.info("================================");
                logger.info(jwtDecode);
                logger.info("================================");
                req.user = jwtDecode;
                logger.info(req.user);
            next();
        }catch(e){
            logger.info("Error nya adalah ");
            logger.error(e.message);
            res.status(404).json({
                errors : "Unauthorized"
            }).end();
        }
    }
};