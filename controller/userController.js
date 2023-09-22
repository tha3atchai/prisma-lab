const {PrismaClient} = require("@prisma/client");
const createError = require("../utils/createError");
const prisma = new PrismaClient();

const getUser = async(req, res, next) => {
    try {
        const {username} = req.body;
        if(username){
            const targetUser = await prisma.user.findUnique({
                where: {
                    username,
                },
            });
            if(!targetUser) return next(createError(400, "Username is wrong."));
            return res.status(200).send(targetUser);
        }
        const targetUser = await prisma.user.findMany(); 
        res.status(200).send(targetUser);
    }catch(err) {
        next(createError(500, "Intenal server error."));
    };
};

const registerUser = async(req, res, next) => {
    try {
        const {username, password, email} = req.body;
        const targetUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if(targetUser) return next(createError(400, "Username is already taken."));
        await prisma.user.create({
            data: {
                username,
                password,
                email,
            },
        });
        res.status(201).send({message: "User is created."});
    }catch(err) {
        next(createError(500, "Intenal server error."));
    };
};

const loginUser = async(req, res, next) => {
    try {
        const {username, password} = req.body; 
        const targetUser = await prisma.user.findUnique({
            where: {
                username,
                password,
            },
        }); 
        if(!targetUser) return next(createError(400, "Username or password is wrong"));
        res.status(201).send({message: "Login is success."}); 
    }catch(err) {
        next(createError(500, "Intenal server error."));
    };
}; 

const updateUser = async(req, res, next) => {
    try {
        const {username, password} = req.body;
        const targetUser = await prisma.user.findUnique({
          where: {
            username,
            },
        });
        if(!targetUser) return next(createError(400, "Username is already taken."));
        await prisma.user.update({
            data: {
                password,
            },
            where: {
                username,
            },
        });
        res.status(200).send({message: "Updating is success."});
    }catch(err) {
        next(createError(500, "Intenal server error."));
    };
};

const deleteUser = async(req, res, next) => {
    try {
        const {username} = req.body;
        const targetUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if(!targetUser) return next(createError(400, "Username is already taken."));
        await prisma.todoList.deleteMany({
            where: {
                userId: targetUser.id,
            },
        });
        await prisma.user.delete({
            where: {
                username,
            },
        });
        res.status(200).send({message: "Delete user success."});
    }catch(err) {
        next(createError(500, "Intenal server error."));
    };
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
};