module.exports = function(req, res, next) {

    if (typeof req.headers.authorization === 'undefined') {

        if (req.originalUrl == '/signin' || req.originalUrl == '/signup') return next();

        return res.status(401).json({msg: 'You do not have permissions to access this data.'});

    }

    next();
};