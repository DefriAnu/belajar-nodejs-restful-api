import { validate } from "../validation/validation.js";
import { loginUserValidation, registeredUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import { ResponseError } from "../error/response-error.js";
import { v4 as uuid} from "uuid";
import jwt from "jsonwebtoken";
import { logger } from "../application/logging.js";

const register = async (request) =>{

    const user = validate(registeredUserValidation, request);

    const countUser = await prismaClient.user.count({
        where:{
            username : user.username
        }
    });

    if(countUser === 1){
        throw new ResponseError(400, "Username is already exists");
    }else{
        user.password = await bcrypt.hash(user.password, 10);

        const result = await prismaClient.user.create({
            data: user,
            select: {
                username : true,
                name : true
            }
        });

        return result;
    }
};

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where:{
            username : loginRequest.username
        },
        select: {
            username : true,
            password : true,
            name: true
        }
    });

    if(!user){
        throw new ResponseError(401, "Username or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if(!isPasswordValid){
        throw new ResponseError(401, "Username or password is wrong");
    }

    const payload = {
        username : user.username,
        name : user.name,
    };

    const secret = process.env.JWT_SECRET;

    const expiredIn = 60 * 60 * 1;

    const token = jwt.sign(payload, secret, {expiresIn : expiredIn});

    return {
        data : {
            username : user.username,
            name : user.name
        },
        token : token
    };
};

const get = async(name) => {
    logger.info("1111111111111111111");

    const username = validate(getUserValidation, name);

    logger.info("1111111111111111111");


    const user = await prismaClient.user.findFirst({
        where:{
            username : username
        },
        select:{
            username: true,
            name : true
        }
    });


    logger.info(user);

    if(!user){
        throw new ResponseError(404, "User is not found");
    }else{
        return user;
    }
};

const update = async(request) => {
    
    const updateRequest = validate(updateUserValidation, request);

    const user = await prismaClient.user.count({
        where:{
            username : updateRequest.username 
        }
    });

    const data = {};
    if(updateRequest.name){
        data.name = updateRequest.name;
    }

    if(updateRequest.password){
        data.password = await bcrypt.hash(updateRequest.password, 10);
    }

    if(user !== 1){
        throw new ResponseError(401, "Username tidak ditemukan");
    }else{
        const update = await prismaClient.user.update({
            data : data,
            where : {
                username : updateRequest.username
            },
            select:{
                username: true,
                name : true
            }
        });
        return update;
    }
};

const logout = async (request) =>{
    const username = validate(getUserValidation, request);

    const count = await prismaClient.user.findUnique({
        where: {
            username : username
        }
    });

    if(!count){
        throw new ResponseError(401, "User is not found");
    }

    const update = await prismaClient.user.update({
        data : {
            token : null
        },
        where :{
            username : username
        },
        select : {
            username : true
        }
    });

    return update;
};

export default{
    register,
    login,
    get,
    update,
    // logout
};