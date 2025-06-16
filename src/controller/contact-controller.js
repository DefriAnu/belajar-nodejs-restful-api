import contactService from "../service/contact-service.js";

const create = async(req, res, next) => {
    try{
        const user = req.user;
        const request = req.body;

        const result = await contactService.create(user, request);
        res.status(201).json({
            data : result
        });
    }catch(e){
        next(e);
    }
};

const get = async(req, res, next) => {
    try{
        const contactId = await req.params.contactId;

        const contact = await contactService.get(req.user, contactId);
        res.status(200).json({
            data : contact
        });
    }catch(e){
        next(e);
    }
};

const update = async(req, res, next) => {
    try{
        const contactId = req.params.contactId;
        const request = req.body;

        const contact = await contactService.update(req.user, request, contactId);
        res.status(200).json({
            data : contact
        });
    }catch(e){
        next(e);
    }
};

const remove = async(req, res, next) => {
    try{
        const contactId = req.params.contactId;

        await contactService.remove(req.user, contactId);

        res.status(200).json({
            data : "OK"
        });
    }catch(e){
        next(e);
    }
};

const search = async(req, res, next) => {
    try{
        const user = req.user;

        const request = {
            size : req.query.size,
            page : req.query.page,
            name : req.query.name,
            email : req.query.email,
            phone : req.query.phone
        };

        const data = await contactService.search(user, request);
        res.status(200).json(data);

    }catch(e){
        next(e);
    }
};

export default {
    create,
    get,
    update,
    remove,
    search
};