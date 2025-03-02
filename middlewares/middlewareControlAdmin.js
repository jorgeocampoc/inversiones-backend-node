const { response: res, request: req } = require('express');

const middlewareControlAdmin = (requiredRole) => (req, res, next) => {
    

    if (!requiredRole) {
        return res.status(401).json({ message: "Acceso denegado: usuario no autenticado." });
    }

    if (requiredRole !== 'Admin') {
        return res.status(403).json({ message: "Acceso restringido: no tiene permisos para acceder a esta sección." });
    }

    next(); 
};

module.exports = middlewareControlAdmin;
