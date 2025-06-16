import { validate } from "../validation/validation.js";
import { createContactValidation, getContactValidation, paramsContactValidation, updateContactValidation } from "../validation/contact-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { logger } from "../application/logging.js";

const create = async(user, request) => {

    const contact = validate(createContactValidation, request);
    
        contact.username = user.username;
    
        return await prismaClient.contact.create({
            data : contact,
            select : {
                id : true,
                first_name : true,
                last_name : true,
                email : true,
                phone : true,
            }
        });
};

const get = async(user, contactId) => {
    const contactIdValidation = validate(getContactValidation, contactId);

    const contact = await prismaClient.contact.findFirst({
        where:{
            id: contactIdValidation,
            username: user.username
        },
        select:{
            id : true,
            first_name : true,
            last_name : true,
            email : true,
            phone : true,
        }
    });

    if(!contact){
        throw new ResponseError(404, "Contact is not found");
    }

    return(contact);
};

const update = async(user, request, contactId) => {
    const dataUpdateValidation = await validate(updateContactValidation, request);
    const contactIdValidation = await validate(getContactValidation, contactId);

    const count = await prismaClient.contact.count({
        where: {
            id : contactIdValidation,
            username : user.username
        }
    });

    if(!count){
        throw new ResponseError(404, "Contact is not found");
    }

    const dataUpdate = {};

    if(dataUpdateValidation.first_name){
        dataUpdate.first_name = dataUpdateValidation.first_name;
    }
    if(dataUpdateValidation.last_name){
        dataUpdate.last_name = dataUpdateValidation.last_name;
    }

    if(dataUpdateValidation.email){
        dataUpdate.email = dataUpdateValidation.email;
    }

    if(dataUpdateValidation.phone){
        dataUpdate.phone = dataUpdateValidation.phone;
    }

    const contactUpdate = await prismaClient.contact.update({
        data : dataUpdate,
        where : {
            id: contactIdValidation,
        },
        select:{
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        }
    });

    return contactUpdate;

};

const remove = async(user, contactId) => {
    const contactIdValidation = validate(getContactValidation, contactId);

    const count = await prismaClient.contact.count({
        where: {
            id : contactIdValidation,
            username : user.username
        }
    });

    if(!count){
        throw new ResponseError(404, "Contact is not found");
    }

    const removeContact = await prismaClient.contact.delete({
        where : {
            id : contactIdValidation
        }
    });

    return removeContact;
};

const search = async(user, request) => {
    request = validate(paramsContactValidation, request);

    const skip = (request.page - 1) * request.size;

    const filters = [];

    filters.push(
        {
            username : user.username
        }
    );

    if(request.name){
        filters.push(
            {
                OR : [
                    {
                        first_name : {
                            contains : request.name
                        }
                    },
                    {
                        last_name : {
                            contains : request.name
                        }
                    },
                ]
            }
        );
    }

    if(request.email){
        filters.push(
            {
                email : {
                    contains : request.email
                }
            }
        );
    }

    if(request.phone){
        filters.push(
            {
                phone : {
                    contains : request.phone
                }
            }
        );
    }

    const data = await prismaClient.contact.findMany({
        where: {
            AND : filters
        },
        take  : request.size,
        skip : skip
    });

    const totalItem = await prismaClient.contact.count({
        where: {
            AND : filters
        }
    });

    return {
        data : data,
        paging : {
            page : request.page,
            totalPage : Math.ceil(totalItem / request.size),
            totalItem : totalItem
        }
    };
};

export default {
    create,
    get,
    update,
    remove,
    search
};