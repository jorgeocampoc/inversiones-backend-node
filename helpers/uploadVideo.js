const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadVideo = ({ file }, extensiones = ['mp4', 'avi', 'mkv'], folder = 'videos') => {
    return new Promise((resolve, reject) => {
        if (!file || !file.name) {
            return reject('Archivo no válido');
        }
        // Obtener extensión con .extname para mayor fiabilidad
        let extension = path.extname(file.name).toLowerCase();
        console.log('Extensión del archivo:', extension);  // Para depuración

        if (!extensiones.includes(extension.slice(1))) {  // Quitamos el punto de la extensión
            return reject('Extensión no válida, las extensiones válidas son mp4, avi, mkv');
        }

        const nameFile = uuidv4() + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameFile);
        console.log('Ruta de subida:', uploadPath);  // Para depuración
        file.mv(uploadPath, (err) => {
            if (err) {
                console.error('Error al mover el archivo:', err);  // Añadimos más detalle en los errores
                return reject(err);
            }
            resolve(nameFile);
        });
    });
}

module.exports = {
    uploadVideo
}