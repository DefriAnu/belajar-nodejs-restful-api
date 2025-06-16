import { validate } from "../validation/validation.js";
import { loginUserValidation, registeredUserValidation, getUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import { ResponseError } from "../error/response-error.js";
import { v4 as uuid} from "uuid";

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
            password : true
        }
    });

    if(!user){
        throw new ResponseError(401, "Username or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if(!isPasswordValid){
        throw new ResponseError(401, "Username or password is wrong");
    }

    const token = uuid().toString();

    return await prismaClient.user.update({
        where : {
            username : loginRequest.username
        },
        data : {
            token : token
        },
        select : {
            token : true
        }
    });
};

const get = async(name) => {
    const username = validate(getUserValidation, name);

    const user = await prismaClient.user.findFirst({
        where:{
            username : username
        },
        select:{
            username: true,
            name : true
        }
    });

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
    logout
};