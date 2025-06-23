import { logger } from "../application/logging.js";
import jwt from "jsonwebtoken";
import userService from "../service/user-service.js";

export const authMiddleware =  (req, res, next) => {

    const auth = req.get("Authorization");
    
    if(!auth){
        res.status(401).json({
            errors : "Unauthorized"
        }).end();
    }else{
        
        const token = auth.split(" ")[1];
        const secret = process.env.JWT_SECRET;

        try {
            const jwtDecode = jwt.verify(token, secret);
                req.user = jwtDecode;
                if(token === userService.tokenjwt.get(req.user.username)){
                    next();
                }else{
                    res.status(404).json({
                        errors : "Unauthorized"
                    }).end();
                }
        }catch(e){
            res.status(404).json({
                errors : "Unauthorized2"
            }).end();
     
        }
    }
};