import { logger } from "../application/logging.js";

import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get("Authorization");

    if(!token){
        res.status(401).json({
            errors : "Unauthorized"
        }).end();
    }else{
        const user = await prismaClient.user.findUnique({
            where: {
                token : token
            }
        });

        if(!user){
            res.status(404).json({
                errors : "Users tidak ditemukan"
            }).end();
        }else{
            req.user = user;
            next();
        }
    }
};