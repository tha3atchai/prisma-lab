module.exports = async(req, res) => {
    res.status(404).send({message: "resource not found."});
};