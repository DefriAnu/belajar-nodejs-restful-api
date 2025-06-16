import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { ResponseError } from "../error/response-error.js";
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation.js";

const checkContactIsMustExist = async (user, contactId) => {
    const contactIdValidation = validate(getContactValidation, contactId);

    const totalContact = await prismaClient.contact.count({
        where :{
            id : contactIdValidation,
            username : user.username
        }
    });

    if(totalContact !== 1){
        throw new ResponseError(404, "Contact is not found");
    }

    return contactIdValidation;
};

const create = async(user, contactId, request) => {

    contactId = await checkContactIsMustExist(user, contactId);

    const address = validate(createAddressValidation, request);
    address.contact_id = contactId;

    return await prismaClient.address.create({
        data : address,
        select: {
            id: true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true,
        }
    });
};

const get = async (user, contactId, addressId) => {

    contactId = await checkContactIsMustExist(user, contactId);

    addressId = validate(getAddressValidation, addressId);

    const address = await prismaClient.address.findFirst({
        where : {
            id : addressId,
            contact_id : contactId
        },
        select : {
            id: true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true,
        }
    });

    if(!address){
        throw new ResponseError(404, "Address is not found");
    }

    return address;
};

const update = async (user, contactId, request) => {

    contactId = await checkContactIsMustExist(user, contactId);
    
    const addressIdValidation = validate(getAddressValidation, request.id);

    const countAddressContact = await prismaClient.address.count({
        where : {
            id : addressIdValidation,
            contact_id : contactId
        }
    });

    if(countAddressContact !== 1){
        throw new ResponseError(404, "Contact is not found");
    }

    request = validate(updateAddressValidation, request);

    const addressUpdate = await prismaClient.address.update({
        where : {
            id : addressIdValidation
        },
        data : {
            street : request.street,
            city : request.city,
            province : request.province,
            country : request.country,
            postal_code : request.postal_code
        },
        select : {
            id: true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true,
        }
    });

    return addressUpdate;
};

const remove = async(user, contactId, addressId) => {

    contactId = await checkContactIsMustExist(user, contactId);
    addressId = validate(getAddressValidation, addressId);

    const isAddress = await prismaClient.address.count({
        where : {
            id : addressId,
            contact_id : contactId
        }
    });

    if(isAddress !== 1){
        throw new ResponseError(404, "Address is not found");
    }

    await prismaClient.address.delete({
        where : {
            id : addressId
        }
    });
};

export const list = async (user, contactId) => {
    contactId = await checkContactIsMustExist(user, contactId);

    const addresses = await prismaClient.address.findMany({
        where : {
            contact_id : contactId
        },
        select : {
            id : true,
            street : true,
            city : true,
            province : true,
            country : true,
            postal_code : true,
        }
    });

    if(addresses.length === 0){
        throw new ResponseError(404, "Address is not found");
    }

    return addresses;
};

export default {
    create,
    get,
    update,
    remove,
    list
};