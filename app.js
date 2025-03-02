var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fileUpload = require('express-fileupload')
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clientsRouter = require('./routes/clients');
var contactRouter = require('./routes/contact');
var postsRouter = require('./routes/posts');
var categoria_postsRouter = require('./routes/categoria_posts');
var logrosRouter = require('./routes/logros');
var categoriesRouter = require('./routes/categories')
var linksRouter = require('./routes/links');
var faqRouter = require('./routes/faq');
var authRouter = require('./routes/auth');
var ajustesRouter = require('./routes/ajustes');
var movimientosRouter = require('./routes/movimientos');
var experienciaRoutes = require('./routes/experienciaRoutes');
var solicitudesRoutes = require('./routes/solicitudes_retiro');
var billeteraRoutes = require('./routes/billetera');
var inversionesRetirosRoutes = require('./routes/inversionesRetiros');
var ajustesAdminRouter = require('./routes/ajustesAdmin');
var rolesRouter = require('./routes/roles');
var comentariosRouter = require('./routes/comentarios');
var utilitiesRouter = require('./routes/utilities');
var reportesRouter = require('./routes/reportes');
var reporteReversionRouter = require('./routes/reporteReversion');
var reportRouter = require('./routes/report');
var perfilRouter = require('./routes/perfil');
var informacionRoutes = require('./routes/informacionRoutes');
var previewRouter = require('./routes/preview');
var solicitudesInversionRouter = require('./routes/solicitudesInversion');
var reporteReversionRouter = require('./routes/reporteReversion');
var reporteSolicitudesInversionRouter = require('./routes/reporteSolicitudesInversion');
var planPagosRouter = require('./routes/planPagos');
const { aprobarAutomaticamenteSolicitudes, aprobarAutomaticamenteInversiones } = require("./controllers/solicitudesInversion");
var cron = require('node-cron');
const { checkInvestmentRequest } = require('./helpers/nodeCron.js');

var app = express();

app.use(cors());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Para leer JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para leer datos urlencoded
app.use('/uploads/categories', express.static(path.join(__dirname, 'uploads/categories')));
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clients', clientsRouter);
app.use('/contact', contactRouter);
app.use('/posts', postsRouter);
app.use('/categoria_posts', categoria_postsRouter);
app.use('/logros', logrosRouter);
app.use('/categories', categoriesRouter)
app.use('/links', linksRouter);
app.use('/faq', faqRouter);
app.use('/auth', authRouter);
app.use('/ajustes', ajustesRouter);
app.use('/movimientos', movimientosRouter);
app.use('/experiencia', experienciaRoutes);
app.use('/solicitudes', solicitudesRoutes);
app.use('/billetera', billeteraRoutes);
app.use('/inversionesRetiros', inversionesRetirosRoutes);
app.use('/ajustesAdmin', ajustesAdminRouter);
app.use('/api/experiencia', experienciaRoutes);
app.use('/roles', rolesRouter);
app.use('/comentarios', comentariosRouter);
app.use('/utilities', utilitiesRouter);
app.use('/reportes', reportesRouter);
app.use('/reporteReversion', reporteReversionRouter);
app.use('/report', reportRouter);
app.use('/perfil', perfilRouter);
app.use('/informacion', informacionRoutes);
app.use('/preview', previewRouter);
app.use('/solicitudesInversion', solicitudesInversionRouter);
app.use('/reporteReversion', reporteReversionRouter);
app.use('/reporteSolicitudesInversion', reporteSolicitudesInversionRouter);
app.use('/planPagos', planPagosRouter);


setInterval(() => {
  aprobarAutomaticamenteSolicitudes();
  aprobarAutomaticamenteInversiones();
}, 86400000);

// se activa a las 23:59 cada dia reversion de solicitudes de inversion
cron.schedule('59 23 * * *', checkInvestmentRequest);

module.exports = app;