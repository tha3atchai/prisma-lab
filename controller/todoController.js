const {PrismaClient} = require("@prisma/client");
const createError = require("../utils/createError");
const prisma = new PrismaClient(); 

const getTargetTodo = async(...obj) => {
    if(obj.length === 2) return await prisma.todoList.findMany({where: {...obj[0], ...obj[1]}});
    if(obj.length === 1) return await prisma.todoList.findMany({where: {...obj[0]}});
};

const getTodo = async(req, res, next) => {
    try{
        const {title, userId} = req.body;
        const targetTodoTitle = await prisma.todoList.findMany({
            where: {
                title,
            },
        });
        const targetTodoUserId = await prisma.todoList.findMany({
            where: {
                userId: +userId || undefined,
            },
        });

        if (!((title === undefined || (targetTodoTitle.length !== 0)) && ( userId === undefined || (targetTodoUserId.length !== 0) && !isNaN(userId)))) return next(createError(400, "title or userId not found."));

        if(title !== undefined && userId !== undefined) return res.status(200).send(await getTargetTodo({title}, {userId: +userId}));

        if(title !== undefined) return res.status(200).send(await getTargetTodo({title}));

        if(userId !== undefined) return res.status(200).send(await getTargetTodo({userId: +userId}));

        const getTodo = await prisma.todoList.findMany();
        res.status(200).send(getTodo);
    }catch(err) {
        console.log(err);
        next(createError(500, "Internal server error."));
    };
};

const createTodo = async(req, res, next) => {
    try {
        const {title, completed, userId} = req.body;
        await prisma.todoList.create({
            data: {
                title,
                completed: (/true/i).test(completed),
                dueDate: new Date("2023-09-02"),
                userId: +userId,
            },
        });
        res.status(201).send({message: "Todo is created."});
    }catch(err) {
        next(createError(500, "Internal server error."));
    };
};

const updateTodo = async(req, res, next) => {
    try {
        const id = +req.params.id;
        const {title, completed, userId} = req.body;
        const targetTodo = await prisma.todoList.findUnique({
            where: {
                id,
                userId: +userId,
            },
        });
        if(!targetTodo) return next(createError(400, "Todo with user_id not found.")); 
        await prisma.todoList.update({
            data: {
                title,
                completed: (/true/i).test(completed),
            },
            where: {
                id,
                userId: +userId,
            },
        });
        res.status(200).send({message: "Updating is success."});
    }catch(err) {
        console.log(err);
        next(createError(500, "Internal server error."));
    };
};

const deleteTodo = async(req, res, next) => {
    try {
        const id = +req.params.id;
        const {userId} = req.body;
        const targetTodo = await prisma.todoList.findUnique({
            where: {
                id,
                userId: +userId,
            },
        });
        if(!targetTodo) return next(createError(400, "Todo with user_id not found.")); 
        await prisma.todoList.delete({
            where: {
                id,
                userId: +userId,
            },
        });
        res.status(200).send({message: "Delete success."});
    }catch(err) {
        console.log();
        next(createError(500, "Internal server error."));
    };
};

module.exports = {
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
};