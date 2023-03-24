module.exports = {
    home: (req, res) => {
        res.status(200).json({
            status: true,
            message: 'welcome to Outh2 server'
        });
    }
};
