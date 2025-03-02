-- --------------------------------------------------------
-- Host:                         viaduct.proxy.rlwy.net
-- Versión del servidor:         9.2.0 - MySQL Community Server - GPL
-- SO del servidor:              Linux
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para railway
CREATE DATABASE IF NOT EXISTS `railway` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `railway`;

-- Volcando estructura para tabla railway.ajustes
CREATE TABLE IF NOT EXISTS `ajustes` (
  `ajuste_id` int NOT NULL AUTO_INCREMENT,
  `comision_fija_ganancia` decimal(10,2) DEFAULT NULL,
  `comision_porcentual_ganancia` decimal(5,2) DEFAULT NULL,
  `comision_fija_retiro` decimal(10,2) DEFAULT NULL,
  `comision_porcentual_retiro` decimal(5,2) DEFAULT NULL,
  `tiempo_minimo_inversion` int DEFAULT NULL,
  `tiempo_maximo_inversion` int DEFAULT NULL,
  `sancion_porcentual_retraso` decimal(5,2) DEFAULT NULL,
  `estado` tinyint NOT NULL DEFAULT '1',
  `valor_token` decimal(10,2) DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `image1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `textHome` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partners` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propositoText` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proposito_imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_moneda` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'USDT',
  PRIMARY KEY (`ajuste_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_id` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.ajustes: ~0 rows (aproximadamente)
INSERT INTO `ajustes` (`ajuste_id`, `comision_fija_ganancia`, `comision_porcentual_ganancia`, `comision_fija_retiro`, `comision_porcentual_retiro`, `tiempo_minimo_inversion`, `tiempo_maximo_inversion`, `sancion_porcentual_retraso`, `estado`, `valor_token`, `admin_id`, `image1`, `image2`, `image3`, `textHome`, `partners`, `propositoText`, `proposito_imagen`, `video`, `logo`, `nombre`, `tipo_moneda`) VALUES
	(6, NULL, 5.00, NULL, 4.00, 3, 3, NULL, 1, 1.00, 23, 'https://res.cloudinary.com/dbvzafbum/image/upload/v1734023774/home/image1.png', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1734023791/home/image2.png', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1734024034/home/image3.png', 'Queremos ayudar a todos los talentos profesionales en áreas como la ingeniería, tecnología y más, a desarrollar sus carreras, aprovechando el apoyo financiero de todos sus seguidores y entusiastas.', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1734019144/home/partners.png', 'Ser el aliado líder en el crecimiento financiero de nuestros clientes, ofreciendo soluciones de inversión innovadoras, seguras y responsables, que generen valor sostenible en el tiempo. Aspiramos a transformar la industria de inversiones mediante el uso de tecnología avanzada, transparencia y compra', 'https://res.cloudinary.com/dpb4sg7pc/image/upload/v1732722280/home/proposito_imagen.png', 'https://www.youtube.com/watch?v=aO5GKcWe-FA', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732894553/home/logo.png', 'Slice2.0', 'USDT');

-- Volcando estructura para tabla railway.categoria_personas
CREATE TABLE IF NOT EXISTS `categoria_personas` (
  `categoria_persona_id` int NOT NULL AUTO_INCREMENT,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `monto_minimo_inversion` int DEFAULT '0',
  `monto_maximo_inversion` int DEFAULT '0',
  `porcentaje_interes` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`categoria_persona_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.categoria_personas: ~13 rows (aproximadamente)
INSERT INTO `categoria_personas` (`categoria_persona_id`, `imagen`, `nombre`, `estado`, `monto_minimo_inversion`, `monto_maximo_inversion`, `porcentaje_interes`) VALUES
	(16, '983e1d00-0170-4039-80a7-d70a8ed525da.png', 'Chofer', 1, 1000, 5000, 5.00),
	(18, 'c09ad69e-3191-4065-b46b-3b36099bd487.jpg', 'Desarrollo de software Backend', 0, 5000, 10000, 2.00),
	(19, '33dfdf61-c8ef-43af-aa34-8a11e5a89e11.png', 'Diseño Gráfico', 0, 1000, 5000, 3.00),
	(20, '2a01efb4-5ed5-43af-9a14-c83a935a56e3.png', 'Desarrollo de software Frontend', 1, 2000, 5000, 3.00),
	(26, '7a4a1fe7-366e-42f3-a748-62fc7a23a0d0.png', 'Arquitectura ', 0, 0, 0, 4.00),
	(47, '4d02bfa3-e79c-44e4-af8b-9f4207751ca0.jpg', 'Ingeniería', 1, 5000, 20000, 5.00),
	(54, '586b55a9-02e2-4429-9992-4c03ca1a4390.jpg', 'Diseño Gráfico 3', 1, 8000, 10000, 5.00),
	(60, '3458904f-cc6b-4a94-b2de-364234f04e73.png', 'Prueba', 1, 222, 333, 5.03),
	(61, 'a6c254d3-f79a-4825-b670-f13a4bace930.png', 'Prueba2', 1, 3333, 4444, 10.03),
	(62, '0187cdd7-4c54-442a-984c-a23374606b8c.png', 'Prueba233', 1, 2221, 33333, 2.30),
	(63, '8f49ac53-b3f3-4364-87f1-756512f33aaa.jpg', 'Derechos Reales', 1, 5000, 7000, 5.00),
	(64, 'a74415d7-c825-4fe6-a77a-f0674ed88365.png', 'Prueba3', 1, 3, 4, 2.00),
	(65, 'f0f55024-510b-4288-a49c-8dc18d732926.png', 'Prueba31', 1, 3, 4, 2.00);

-- Volcando estructura para tabla railway.comentarios
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id_comentarios` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `inversor_id` int DEFAULT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `respuesta` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calificacion` int DEFAULT '0',
  `estado` enum('Aprobado','Rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Aprobado',
  PRIMARY KEY (`id_comentarios`),
  KEY `fk_cliente_id_idx` (`cliente_id`),
  KEY `fk_inversor_id_idx` (`inversor_id`),
  CONSTRAINT `fk_cliente_id` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_inversor_id` FOREIGN KEY (`inversor_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.comentarios: ~0 rows (aproximadamente)

-- Volcando estructura para tabla railway.contacto
CREATE TABLE IF NOT EXISTS `contacto` (
  `contacto_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comentarios` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `respuesta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contacto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.contacto: ~7 rows (aproximadamente)
INSERT INTO `contacto` (`contacto_id`, `nombre`, `apellido`, `email`, `telefono`, `comentarios`, `respuesta`, `estado`, `created_at`, `updated_at`) VALUES
	(39, 'Victor Hugo', 'Sejas Burgoa', 'victorhugo31103@gmail.com', '31231', '33', '', 0, '2024-11-25 16:29:39', '2024-11-25 16:29:39'),
	(40, 'Victor Hugo', 'Sejas Burgoa', 'victorhugo31103@gmail.com', '1q21', '13', NULL, 0, '2024-11-26 13:52:17', '2024-11-26 13:52:17'),
	(41, 'Victor Hugo', 'Sejas Burgoa', 'victorhugo31103@gmail.com', '2', 'd', NULL, 0, '2024-11-26 14:09:35', '2024-11-26 14:09:35'),
	(42, 'fdsfds', 'fdsfds', 'fdsfds@fdsafds.com', 'fdfdsfdsfdsfds', '', 'respondido', 1, '2024-11-26 14:33:35', '2024-11-26 14:33:35'),
	(43, 'Victor Hugo', 'Sejas Burgoa', 'victorhugo31103@gmail.com', 'eqwe', 'qweqwe', NULL, 0, '2024-11-27 03:04:57', '2024-11-27 03:04:57'),
	(44, 'Victor Hugo', 'Sejas Burgoa', 'victorhugo31103@gmail.com', '14', 'p', NULL, 0, '2024-11-27 13:52:15', '2024-11-27 13:52:15'),
	(45, 'Aute doloribus non l', 'Facilis eos quod aut', 'pygo@mailinator.com', '+1 (181) 745-3211', 'Duis placeat volupt', 'respondido', 0, '2024-11-27 21:18:01', '2024-11-27 21:18:01');

-- Volcando estructura para tabla railway.experiencia
CREATE TABLE IF NOT EXISTS `experiencia` (
  `experiencia_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `institucion` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actividades` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`experiencia_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `experiencia_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.experiencia: ~11 rows (aproximadamente)
INSERT INTO `experiencia` (`experiencia_id`, `cliente_id`, `institucion`, `cargo`, `actividades`, `fecha_inicio`, `fecha_final`, `estado`) VALUES
	(33, 145, NULL, NULL, NULL, '2023-02-25', NULL, 1),
	(34, 144, 'Unibienes', 'Analista de Desarrollo', 'Desarrollo full Stack', '2024-11-01', '2024-11-22', 1),
	(35, 149, NULL, NULL, NULL, '2022-10-10', NULL, 1),
	(36, 151, NULL, NULL, NULL, '2021-01-01', NULL, 1),
	(37, 153, NULL, NULL, NULL, '1992-01-01', NULL, 1),
	(38, 159, NULL, NULL, NULL, '2024-11-26', NULL, 1),
	(39, 144, NULL, NULL, NULL, '2024-11-04', NULL, 1),
	(41, 139, 'Numquam quis optio', 'Tempore autem ut qu', 'Laborum Sed tempora', '1987-01-25', '1991-10-06', 1),
	(42, 166, 'Quas fugit do ipsum', 'Natus voluptatibus e', 'Autem eligendi sint', '2002-10-16', '2005-12-15', 1),
	(43, 170, 'Maxime sequi earum h', 'Rerum qui quibusdam', 'Accusantium voluptat', '2024-12-01', '2024-12-13', 1),
	(44, 171, 'dsadasd', 'asdasd', 'asdasd', '2020-02-16', '2024-12-16', 1),
	(45, 174, 'adsadasdasdada', 'dsadsada', 'dsadsa', '2025-01-30', '2025-02-03', 1);

-- Volcando estructura para tabla railway.informacion
CREATE TABLE IF NOT EXISTS `informacion` (
  `info_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `ocupacion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `monto_inversion` int DEFAULT '1',
  `cantidad_maxima_inversiones` int DEFAULT NULL,
  `preparacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estudios` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vision` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `video` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inversion_control` int DEFAULT '0',
  PRIMARY KEY (`info_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `informacion_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.informacion: ~11 rows (aproximadamente)
INSERT INTO `informacion` (`info_id`, `cliente_id`, `ocupacion`, `descripcion`, `monto_inversion`, `cantidad_maxima_inversiones`, `preparacion`, `estudios`, `vision`, `estado`, `video`, `imagen`, `inversion_control`) VALUES
	(13, 149, 'Ingeniero de software', 'Soy un ingeniero de software con [número de años] años de experiencia en el diseño y desarrollo de aplicaciones web y móviles. Mi enfoque principal es crear soluciones tecnológicas eficientes, escalables y centradas en el usuario', 10, 20, 'Título Universitario: Ingeniero en Sistemas de Información Universidad [Nombre de la Universidad] | [Año de finalización] Formación sólida en fundamentos de programación, estructuras de datos, bases de datos, ingeniería de software y redes informáticas.', 'Ingeniería en Sistemas de Información Universidad [Nombre de la Universidad] [Años de estudio, ej. 2018 - 2023]', 'Mi visión es ser un líder en el desarrollo de soluciones tecnológicas innovadoras que impacten positivamente en la vida de las personas y las operaciones de las empresas. Aspiro a crear software eficiente, escalable y accesible, mientras contribuyo al avance de la industria tecnológica mediante el aprendizaje continuo y la colaboración en proyectos de alto impacto.\n\nCreo en el poder de la tecnología para transformar realidades, y mi objetivo es formar parte de equipos que valoren la creatividad, la calidad y el enfoque en el usuario. Mi meta a largo plazo es combinar habilidades técnicas con liderazgo para guiar iniciativas que impulsen el cambio y el crecimiento sostenible.', 1, '4fc1bddb-5837-40cc-8dd5-ce2a1ade7140.mp4', NULL, 0),
	(14, 144, 'Ingeniero de Sistemas', 'Dedicado al Desarrollo Web con experiencia de 1 año', 50, 200, 'Ingeniero ', 'Universidad', 'Aperturar empresa de desarrollo', 1, 'a1bc6f7b-7513-4eff-a932-a33d83b90d88.mp4', NULL, 0),
	(15, 151, 'estudiante', 'asd', 10, 20, 'asd', 'tec', 'futuro', 1, 'e5b43861-202c-492b-83bc-c2560071fdff.mp4', NULL, 0),
	(17, 153, 'Hacker', 'Ciberseguridad', 200, 1000, 'Berlin College', 'Ciberseguridad', 'Controlar y/o erradicar la pirateria', 1, NULL, NULL, 0),
	(21, 159, ' ', '  ', 1, 0, ' ', ' ', ' ', 1, NULL, NULL, 0),
	(22, 139, 'Nobis sunt qui deser', 'Sed enim amet ad au', 10, 100, 'Consectetur temporib', 'Labore consectetur s', 'Reprehenderit velit', 1, NULL, NULL, 0),
	(23, 166, 'Ipsa in dolores ill', 'Qui sit do enim fug', 1, 500, 'Non incididunt esse', 'Quo autem accusantiu', 'Tempora est nihil ma', 1, 'video', NULL, 0),
	(27, 168, 'Desarrollador', 'Desarrollador de software', 50, 500, 'Licenciatura en Ciencias de la Computación', 'Universidad XYZ', 'Crear soluciones innovadoras', 1, NULL, NULL, 0),
	(30, 170, 'Sit nostrum esse Na', 'Quia consectetur vol', 50, 500, 'Id laboriosam assum', 'Quos velit in in pla', 'Lorem sit id volup', 1, 'a7a203ac-de53-4400-aa2a-6c9f0e1fca6c.mp4', NULL, 0),
	(31, 171, 'fronted', 'fronted', 1, NULL, 'fronted', 'fronted', 'front', 1, '1d571b62-58e0-4764-93f9-2856c1ac25d3.mp4', NULL, 0),
	(32, 145, 'Dolore ratione conse', 'Autem similique et i', 100, 400, 'Ut similique unde as', 'Ea rem minim quasi s', 'Asperiores iste quib', 1, '0e41e671-bf31-4359-9936-d46bfcc82820.mp4', NULL, 0),
	(33, 174, 'adsadsadsadsa', 'dsadsadsadsad', NULL, NULL, 'dasdsadasdasds', 'sdadsadsad', 'adsdadasdasdsadsadas', 1, 'f9a555ff-5c5c-484b-bab8-78a341c49339.mp4', NULL, 0);

-- Volcando estructura para tabla railway.informacion_inversionista
CREATE TABLE IF NOT EXISTS `informacion_inversionista` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_inversionista` int DEFAULT NULL,
  `nombre_completo` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dni` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_dni` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `domicilio` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `situacion_laboral` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuente_de_ingresos` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_selfie` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `imagen_pasaporte_anv` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `imagen_pasaporte_rev` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `FK_idinversionista` (`id_inversionista`),
  CONSTRAINT `FK_idinversionista` FOREIGN KEY (`id_inversionista`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.informacion_inversionista: ~7 rows (aproximadamente)
INSERT INTO `informacion_inversionista` (`id`, `id_inversionista`, `nombre_completo`, `dni`, `tipo_dni`, `domicilio`, `ciudad`, `situacion_laboral`, `fuente_de_ingresos`, `imagen_selfie`, `imagen_pasaporte_anv`, `imagen_pasaporte_rev`) VALUES
	(13, 148, 'Alex', '6666666', 'ci', 'Tangamandapio', 'La Paz', 'Independiente', 'Comercio', NULL, NULL, NULL),
	(14, 140, 'Brian', '123456', 'ci', 'One Piece', 'Grand Blue', 'Independiente', 'Pirata', NULL, NULL, NULL),
	(15, 160, 'leo', '  ', 'ci', ' ', ' ', '', ' ', NULL, NULL, NULL),
	(16, 161, 'leo', 'fdsfd1212', 'pasaporte', '  ', '  ', '', '  ', NULL, NULL, NULL),
	(17, 143, 'juan', '789789789', 'ci', 'calle aroma', 'Cercado', 'Independiente', 'Autonomo', NULL, NULL, NULL),
	(20, 173, 'Cecilia', '5524659', 'ci', 'Grover Suarez Nº 141', 'Cochabambaa', 'Independiente', 'independiente', NULL, NULL, NULL),
	(21, 171, 'Danny', '87312522', 'ci', 'calle arauco', 'cochabambas', 'Profesional', 'asddasdasdas', NULL, NULL, NULL),
	(22, 176, 'Ruth', '8814563', 'ci', 'Cochabamba ciudad', 'Cochabamba ciudad', 'Profesional', 'Trabajo de Contaduria', NULL, NULL, NULL);

-- Volcando estructura para tabla railway.inversiones
CREATE TABLE IF NOT EXISTS `inversiones` (
  `inversion_id` int NOT NULL AUTO_INCREMENT,
  `solicitud_inv_id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `inversor_id` int DEFAULT NULL,
  `monto` int DEFAULT '0',
  `tipo_ganancia` enum('Monto fijo','Porcentual') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ganancia_estimada` decimal(10,2) DEFAULT NULL,
  `fecha_deposito` date DEFAULT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`inversion_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `inversor_id` (`inversor_id`),
  KEY `solicitud_inv_id` (`solicitud_inv_id`),
  CONSTRAINT `inversiones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `inversiones_ibfk_2` FOREIGN KEY (`inversor_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `inversiones_ibfk_3` FOREIGN KEY (`solicitud_inv_id`) REFERENCES `solicitudes_inversion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.inversiones: ~3 rows (aproximadamente)
INSERT INTO `inversiones` (`inversion_id`, `solicitud_inv_id`, `cliente_id`, `inversor_id`, `monto`, `tipo_ganancia`, `ganancia_estimada`, `fecha_deposito`, `fecha_devolucion`, `estado`) VALUES
	(214, 73, 145, 143, 1000, NULL, 80.00, '2025-02-04', '2025-05-04', 1),
	(215, 74, 174, 175, 5000, NULL, 5250.00, '2025-02-04', '2025-05-04', 1),
	(216, 74, 174, 176, 1000, NULL, 1050.00, '2025-02-04', '2025-05-04', 1);

-- Volcando estructura para tabla railway.links
CREATE TABLE IF NOT EXISTS `links` (
  `link_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`link_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `links_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.links: ~0 rows (aproximadamente)

-- Volcando estructura para tabla railway.logros
CREATE TABLE IF NOT EXISTS `logros` (
  `logro_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`logro_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `logros_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.logros: ~15 rows (aproximadamente)
INSERT INTO `logros` (`logro_id`, `cliente_id`, `descripcion`, `estado`, `fecha`) VALUES
	(29, 145, 'Concurso de Traviesos', 1, '2024-11-14 00:00:00'),
	(30, 149, 'Desarrollé y optimicé una aplicación web en Vue.js que mejoró la experiencia del usuario, logrando un aumento del 30% en la retención de usuarios durante los primeros tres meses de implementación.', 1, '2024-10-10 00:00:00'),
	(31, 144, 'Especialidad en desarrollo web.', 1, '2024-11-01 00:00:00'),
	(32, 151, 'titulo', 1, '2023-01-02 00:00:00'),
	(33, 153, 'Trabaje para google para la busqueda de bulnerabilidades', 1, '1992-01-01 00:00:00'),
	(34, 144, 'Win', 1, '2002-12-14 00:00:00'),
	(35, 159, '  ', 1, '2024-11-26 00:00:00'),
	(36, 144, 'eqw', 1, '2000-03-21 00:00:00'),
	(37, 144, 'dszfhbsfhsdfhnsd', 1, '2000-02-12 00:00:00'),
	(38, 139, 'Quasi eos reprehend', 1, '2005-07-31 00:00:00'),
	(39, 139, 'Sed laudantium ipsu', 1, '2024-10-02 00:00:00'),
	(40, 139, 'Aut reprehenderit m', 1, '2024-11-01 00:00:00'),
	(41, 166, 'Asperiores amet qui', 1, '2015-04-06 00:00:00'),
	(42, 170, 'Desperté a las 09:00', 1, '2024-12-13 00:00:00'),
	(43, 171, 'asdaasda', 1, '2024-12-16 00:00:00'),
	(44, 174, 'asdadsa', 1, '2005-12-10 00:00:00');

-- Volcando estructura para tabla railway.movimientos
CREATE TABLE IF NOT EXISTS `movimientos` (
  `movimiento_id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('Ingreso','Egreso') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT '0.00',
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_desembolso` date DEFAULT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `inversiones_id` int DEFAULT NULL,
  `solicitudes_retiro_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `token` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`movimiento_id`),
  KEY `inversiones_id` (`inversiones_id`),
  KEY `solicitudes_retiro_id` (`solicitudes_retiro_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `inversiones_id` FOREIGN KEY (`inversiones_id`) REFERENCES `inversiones` (`inversion_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `solicitudes_retiro_id` FOREIGN KEY (`solicitudes_retiro_id`) REFERENCES `solicitudes_retiro` (`retiro_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=920 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.movimientos: ~88 rows (aproximadamente)
INSERT INTO `movimientos` (`movimiento_id`, `tipo`, `monto`, `descripcion`, `fecha_solicitud`, `fecha_desembolso`, `estado`, `inversiones_id`, `solicitudes_retiro_id`, `usuario_id`, `token`) VALUES
	(907, 'Ingreso', 1000.00, 'Compra de tokens', '2025-02-04 13:16:24', '2025-02-04', 1, NULL, NULL, 143, 1000.00),
	(908, 'Egreso', 0.00, 'Tokens invertidos', '2025-02-04 13:17:14', NULL, 1, 214, NULL, 143, 1000.00),
	(909, 'Ingreso', 0.00, 'Inversión recibida', '2025-02-04 13:17:14', NULL, 1, 214, NULL, 145, 1000.00),
	(910, 'Ingreso', 80.00, 'Compra de tokens', '2025-02-04 13:20:09', '2025-02-04', 1, NULL, NULL, 145, 80.00),
	(911, 'Ingreso', 0.00, 'Ganancia web', '2025-02-04 09:20:32', NULL, 1, NULL, NULL, 150, 32.40),
	(912, 'Egreso', 0.00, 'Pago cuota', '2025-02-04 13:20:32', NULL, 1, NULL, NULL, 145, 1080.00),
	(913, 'Ingreso', 0.00, 'Tokens invertidos', '2025-02-04 13:20:32', NULL, 1, NULL, NULL, 143, 1030.00),
	(914, 'Ingreso', 6000.00, 'Compra de tokens', '2025-02-04 16:20:55', '2025-02-04', 1, NULL, NULL, 176, 6000.00),
	(915, 'Ingreso', 9000.00, 'Compra de tokens', '2025-02-04 16:22:22', '2025-02-04', 1, NULL, NULL, 175, 9000.00),
	(916, 'Egreso', 0.00, 'Tokens invertidos', '2025-02-04 16:24:18', NULL, 1, 215, NULL, 175, 5000.00),
	(917, 'Ingreso', 0.00, 'Inversión recibida', '2025-02-04 16:24:18', NULL, 1, 215, NULL, 174, 5000.00),
	(918, 'Egreso', 0.00, 'Tokens invertidos', '2025-02-04 16:29:21', NULL, 1, 216, NULL, 176, 1000.00),
	(919, 'Ingreso', 0.00, 'Inversión recibida', '2025-02-04 16:29:21', NULL, 1, 216, NULL, 174, 1000.00);

-- Volcando estructura para tabla railway.plan_pagos
CREATE TABLE IF NOT EXISTS `plan_pagos` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `solicitud_inv_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `num_pago` int NOT NULL,
  `monto_pago` decimal(10,2) NOT NULL,
  `fecha_programada` date NOT NULL,
  `estado_pago` enum('Pendiente','Pagado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  `fecha_pagada` date DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `fk_solicitud_inv` (`solicitud_inv_id`),
  KEY `fk_cliente_plan` (`cliente_id`),
  CONSTRAINT `fk_cliente_plan` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `fk_solicitud_inv` FOREIGN KEY (`solicitud_inv_id`) REFERENCES `solicitudes_inversion` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.plan_pagos: ~12 rows (aproximadamente)
INSERT INTO `plan_pagos` (`plan_id`, `solicitud_inv_id`, `cliente_id`, `num_pago`, `monto_pago`, `fecha_programada`, `estado_pago`, `fecha_pagada`) VALUES
	(73, 70, 145, 1, 1080.00, '2025-10-10', 'Pagado', '2025-02-04'),
	(74, 71, 145, 1, 1080.00, '2025-10-10', 'Pagado', '2025-02-04'),
	(75, 72, 145, 1, 1080.00, '2025-08-08', 'Pagado', '2025-02-04'),
	(76, 73, 145, 1, 1080.00, '2025-08-08', 'Pagado', '2025-02-04'),
	(77, 74, 174, 1, 733.33, '2025-03-01', 'Pendiente', NULL),
	(78, 74, 174, 2, 733.33, '2025-04-01', 'Pendiente', NULL),
	(79, 74, 174, 3, 733.33, '2025-05-01', 'Pendiente', NULL),
	(80, 74, 174, 4, 733.33, '2025-06-01', 'Pendiente', NULL),
	(81, 74, 174, 5, 733.33, '2025-07-01', 'Pendiente', NULL),
	(82, 74, 174, 6, 733.33, '2025-08-01', 'Pendiente', NULL),
	(83, 74, 174, 7, 733.33, '2025-09-01', 'Pendiente', NULL),
	(84, 74, 174, 8, 733.33, '2025-10-01', 'Pendiente', NULL),
	(85, 74, 174, 9, 733.33, '2025-11-01', 'Pendiente', NULL),
	(86, 74, 174, 10, 733.33, '2025-12-01', 'Pendiente', NULL),
	(87, 74, 174, 11, 733.33, '2026-01-01', 'Pendiente', NULL),
	(88, 74, 174, 12, 733.33, '2026-02-01', 'Pendiente', NULL),
	(89, 74, 174, 13, 733.33, '2026-03-01', 'Pendiente', NULL),
	(90, 74, 174, 14, 733.33, '2026-04-01', 'Pendiente', NULL),
	(91, 74, 174, 15, 733.33, '2026-05-01', 'Pendiente', NULL);

-- Volcando estructura para tabla railway.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_portada` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Inactivo',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.posts: ~3 rows (aproximadamente)
INSERT INTO `posts` (`post_id`, `titulo`, `imagen_portada`, `contenido`, `estado`, `created_at`, `updated_at`) VALUES
	(1, 'Guia Inversor', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732721112/posts/posts/1732721109722.png', '<h1><span style="background-color: var(--bs-modal-bg); color: var(--bs-heading-color); font-size: 2.5rem; text-align: var(--bs-body-text-align);">Guía para el usuario con rol Inversores</span></h1><h2>Introducción</h2><p>La plataforma conecta inversores con talentos en diversos campos. Esta guía te ayudará a realizar inversiones y manejar tus tokens.</p><p>Desde "Soporte", elige:</p><ul><li><b>Chat en Vivo:</b> Para atención inmediata.</li><li><b>Formulario:</b> Reporta problemas con capturas de pantalla.</li></ul>', 'Inactivo', '2024-10-22 20:07:49', '2024-10-22 20:07:49'),
	(2, 'Requisitos Previos', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732720897/posts/posts/1732720894376.png', '<br>\r\n<h2>Guía para el usuario con rol Talento</h2>\r\n<ol>\r\n	<li>\r\n	Como talento, puedes recibir inversiones y gestionar proyectos. Esta guía te ayudará a aprovechar al máximo tus herramientas.</li>\r\n	<hr>\r\n	<li>\r\n	<ul>\r\n		<li>Cuenta Registrada: Completa el proceso de registro.</li>		\r\n		<li>Perfil Completo: Verifica y actualiza tu información.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Acceso al Sistema</h3>\r\n	<ul>\r\n		<li>Iniciar Sesión: Ingresa tu correo y contraseña.</li>		\r\n		<li>Actualizar Perfil: Revisa datos personales en "Mi Perfil".</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Seguimiento de Inversiones</h3>\r\n		<ul>\r\n		<li>Consultar Inversiones: Accede a "Mi Billetera" para ver el estado de los proyectos.</li>\r\n		<li>Notificaciones: Recibe alertas sobre devoluciones pendientes.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Retiro de Beneficios</h3>\r\n		<ul>\r\n		<li>Verificar Saldo: Revisa tus ganancias disponibles.</li>		\r\n		<li>Seleccionar Método de Retiro: Transferencia bancaria o conversión de tokens.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Soporte Técnico</h3>\r\n	Desde "Soporte", accede al:\r\n		<ul>\r\n		<li>Chat en Vivo: Atención rápida.</li>\r\n		<li>Formulario: Detalla problemas con capturas de pantalla.</li></ul>\r\n	</li>\r\n	<hr></ol>', 'Activo', '2024-10-22 22:52:23', '2024-10-22 22:52:23'),
	(3, 'Guia Admin', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732720919/posts/posts/1732720916205.png', '<br>\r\n<h2>Guía para el usuario con rol Administrador</h2>\r\n<ol>\r\n	<li>\r\n	La guía detalla las funcionalidades básicas disponibles para un Administrador en la plataforma Hamilo Inversiones. Aquí encontrarás todo lo necesario para gestionar usuarios, guías, solicitudes, y más.</li>\r\n	<hr>\r\n	<li><h3>Cambiar Imagen</h3>\r\n	El administrador puede subir una nueva imagen en cualquier sección donde aparezca el ícono de editar imágen.<br>\r\n	Al seleccionarlo, se abrirá una ventana para elegir y cargar una nueva imagen.</li>\r\n	<hr>\r\n	<li><h3>Editar Texto</h3>\r\n	Donde aparezca el ícono de editar texto, el administrador puede modificar textos y actualizar la información mostrada en la plataforma.</li>\r\n	<hr>\r\n	<li><h3>Solicitudes de Retiro</h3>\r\n	El administrador puede aprobar o rechazar retiros desde la sección Solicitudes de Retiro, disponible en el menú lateral izquierdo tras hacer clic en el botón del administrador, que se encuentra en la parte derecha del menú superior.<br>\r\n\r\n	En esta sección:\r\n		<ul>\r\n		<li>✅ Aprobar solicitud\r\n		</li><li>❌ Rechazar solicitud</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Gestión de Usuarios</h3>\r\n	Desde la sección Usuarios, el administrador puede:\r\n		<ul>\r\n		<li>Asignar Roles: Cambiar el rol de los usuarios.</li>\r\n		<li>Aprobar Registro: Cambiar el estado de admisión entre aprobado/no aprobado.</li>\r\n		<li>Activar/Inactivar Usuarios: Alternar el estado con los íconos ➕ y ➖.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Gestión de Guías</h3>\r\n	En la sección Guías, el administrador puede:\r\n		<ul>\r\n		<li>Editar el contenido.</li>\r\n		<li>Aceptar correcciones realizadas.</li>\r\n		<li>Eliminar guías con el botón ❌.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Categorías</h3>\r\n	Desde la sección Categorías, se pueden crear nuevas categorías. El formulario incluye:\r\n		<ul>\r\n		<li>Nombre: Título de la categoría (una palabra sugerida).</li>\r\n		<li>Imagen: Ícono representativo.</li>\r\n		<li>Botón Crear: Guarda la categoría y la lista en la tabla.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Consultas y Reclamos</h3>\r\n	En la sección Consultas y Reclamos, el administrador puede:\r\n		<ul>\r\n		<li>Responder: Completar un formulario para contestar consultas pendientes.</li>\r\n		<li>Actualizar Estados: Cambiar el estado de las consultas.</li></ul>\r\n	</li>\r\n	<hr>\r\n	<li><h3>Reportes</h3>\r\n	Muestra gráficos con resúmenes de operaciones realizadas en la plataforma. Incluye opciones para descargar reportes.</li>\r\n	<hr>\r\n	<li><h3>Ajustes</h3>\r\n	Se accede desde el menú lateral y permite modificar datos de la plataforma a través de formularios editables.</li>\r\n	<hr>\r\n	<li><h3>Preguntas Frecuentes (FAQs)</h3>\r\n	El administrador puede:\r\n	<ul>\r\n	<li>Agregar FAQs: Completar un formulario con una pregunta y respuesta.</li>\r\n	<li>Editar FAQs: Modificar preguntas o respuestas existentes.</li>\r\n	<li>Eliminar FAQs: Quitar entradas seleccionadas.</li></ul>\r\n	</li>\r\n	<hr></ol>', 'Activo', '2024-10-23 02:23:56', '2024-10-23 02:23:56');

-- Volcando estructura para tabla railway.respuesta
CREATE TABLE IF NOT EXISTS `respuesta` (
  `respuesta_id` int NOT NULL,
  `comentario_id` int DEFAULT NULL,
  `inversor_id` int DEFAULT NULL,
  `respuesta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`respuesta_id`),
  KEY `fk_comentario_idx` (`comentario_id`),
  CONSTRAINT `fk_comentario_idx` FOREIGN KEY (`comentario_id`) REFERENCES `comentarios` (`id_comentarios`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.respuesta: ~0 rows (aproximadamente)

-- Volcando estructura para tabla railway.solicitudes_inversion
CREATE TABLE IF NOT EXISTS `solicitudes_inversion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL DEFAULT '0',
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_inicio_recaudacion` date NOT NULL,
  `fecha_fin_recaudacion` date NOT NULL,
  `monto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cantidad_pagos` int NOT NULL DEFAULT '0',
  `fecha_inicio_pago` date NOT NULL,
  `fecha_fin_pago` date NOT NULL,
  `aprobado` enum('Inicial','Pendiente','Aprobado','Rechazado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Inicial',
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `observaciones` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado_inversion` enum('Inicial','Pendiente','Proceso','Finalizado','Reversion') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Inicial',
  `porcentaje_interes` decimal(5,2) DEFAULT '0.00',
  `canceladoPor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Admin',
  `fecha_solicitud` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `si_cliente_id` (`cliente_id`) USING BTREE,
  CONSTRAINT `si_cliente_id` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla railway.solicitudes_inversion: ~2 rows (aproximadamente)
INSERT INTO `solicitudes_inversion` (`id`, `cliente_id`, `nombre`, `descripcion`, `fecha_inicio_recaudacion`, `fecha_fin_recaudacion`, `monto`, `cantidad_pagos`, `fecha_inicio_pago`, `fecha_fin_pago`, `aprobado`, `estado`, `observaciones`, `estado_inversion`, `porcentaje_interes`, `canceladoPor`, `fecha_solicitud`) VALUES
	(73, 145, 'nuevo', 'desc', '2025-02-04', '2025-02-08', 1000.00, 1, '2025-08-08', '2025-09-08', 'Aprobado', 1, '', 'Finalizado', 8.00, 'Admin', '2025-02-04 09:14:05'),
	(74, 174, 'Diplomado en Análisis de Datos', 'Diplomado en analisis de datos', '2025-02-03', '2025-02-20', 10000.00, 15, '2025-03-01', '2026-05-29', 'Aprobado', 1, '', 'Pendiente', 10.00, 'Admin', '2025-02-04 11:55:06');

-- Volcando estructura para tabla railway.solicitudes_retiro
CREATE TABLE IF NOT EXISTS `solicitudes_retiro` (
  `retiro_id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('cliente','inversor') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `monto_solicitud` decimal(10,2) DEFAULT '0.00',
  `tokens_cambio` decimal(10,2) DEFAULT '0.00',
  `comision_aplicar` decimal(5,2) DEFAULT '0.00',
  `monto_recibir` decimal(10,2) DEFAULT '0.00',
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_aprobacion` date DEFAULT NULL,
  `foto_identificacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `selfie_identificacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Pagado','Pendiente','Aprobado','Rechazado','Eliminado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  `inversion_id` int DEFAULT NULL,
  PRIMARY KEY (`retiro_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `inversion_id` (`inversion_id`),
  CONSTRAINT `solicitudes_retiro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `solicitudes_retiro_ibfk_2` FOREIGN KEY (`inversion_id`) REFERENCES `inversiones` (`inversion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.solicitudes_retiro: ~2 rows (aproximadamente)
INSERT INTO `solicitudes_retiro` (`retiro_id`, `tipo`, `usuario_id`, `monto_solicitud`, `tokens_cambio`, `comision_aplicar`, `monto_recibir`, `fecha_solicitud`, `fecha_aprobacion`, `foto_identificacion`, `selfie_identificacion`, `estado`, `inversion_id`) VALUES
	(113, 'inversor', 171, 100.00, 100.00, 0.00, 100.00, '2025-01-15 19:59:53', NULL, NULL, NULL, 'Pendiente', NULL),
	(114, 'cliente', 171, 100.00, 100.00, 0.00, 100.00, '2025-01-15 20:58:39', NULL, NULL, NULL, 'Pendiente', NULL);

-- Volcando estructura para tabla railway.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_pais` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais_residencia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `acepta_terminos` tinyint(1) DEFAULT NULL,
  `categoria_persona_id` int DEFAULT NULL,
  `rol` enum('Inversionista','Cliente','Admin','Null') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `cod_verificacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verificado` tinyint(1) NOT NULL DEFAULT '0',
  `saldo_total` decimal(10,2) DEFAULT '0.00',
  `registrado_por` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aprobado` tinyint(1) DEFAULT '0',
  `resetPasswordToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resetPasswordExpires` bigint DEFAULT NULL,
  `genero` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `porcentaje_registro` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '0%',
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `numero_telefono` (`numero_telefono`),
  KEY `categoria_persona_id` (`categoria_persona_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`categoria_persona_id`) REFERENCES `categoria_personas` (`categoria_persona_id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla railway.usuarios: ~31 rows (aproximadamente)
INSERT INTO `usuarios` (`usuario_id`, `nombre`, `apellido`, `correo`, `codigo_pais`, `numero_telefono`, `username`, `pais_residencia`, `password`, `edad`, `acepta_terminos`, `categoria_persona_id`, `rol`, `created_at`, `updated_at`, `estado`, `cod_verificacion`, `verificado`, `saldo_total`, `registrado_por`, `aprobado`, `resetPasswordToken`, `resetPasswordExpires`, `genero`, `imagen`, `video`, `porcentaje_registro`) VALUES
	(140, 'Brian', 'Villarroel', 'braal.vf@gmail.com', '+591', '76543210', 'Brian - Villarroel', 'Bolivia', '$2b$10$QfURX5A.flFB9CYg/vo7uO4lIpN.DJBmW9oruYpKVruyIatgMZcU6', 32, 1, 16, 'Inversionista', '2024-11-25 13:37:00', '2024-11-25 13:37:00', 1, '1e80ab3a68c8ecb03cbd77dc5042bda28e357038', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732544180/clients/140.jpg', NULL, '100%'),
	(142, 'cecilia ', 'Velarde', 'airamposoruco@gmail.com', '+591', '60397621', 'cecilia  - Velarde', 'Bolivia', '$2b$10$rGg18E/rfqdJvtbU78lhJ.BLTcK6ejLllptG/LRaWENrr/oJVM6kW', 33, 1, NULL, 'Admin', '2024-11-25 13:38:28', '2024-11-25 13:38:28', 1, 'c6ada34e5f6096d23d45d2ec9799217a1c549ff1', 1, 0.00, '', 1, NULL, NULL, 'mujer', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732549700/clients/142.jpg', NULL, '20%'),
	(143, 'inversionista', 'inver', 'inver@gmail.com', '+591', '45645645', 'inversionista - inver', 'Bolivia', '$2b$10$cbaTGqNRwxjE2UezjKWD0es/lOHX1Adk4pjfNSadsT7yy3TNetB.W', 24, 1, 16, 'Inversionista', '2024-11-25 13:41:25', '2024-11-25 13:41:25', 1, '7658ef742c85cad0aa890703ba8f3b691666f002', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732652362/clients/143.png', NULL, '100%'),
	(144, 'Victor Hugo', 'Bolivia', 'victorhugo31103@gmail.com', '+591', '62554738', 'Victor Hugo - Bolivia', 'Argentina', '$2b$10$UERZZYj0IoPYkNQKQJZhd.tL2AHUsikYU/5fp8e/hsVQyQGinjMxy', 32, 1, NULL, 'Cliente', '2024-11-25 13:42:16', '2024-11-25 13:42:16', 1, '20d6894bfa066b5e380b563d04955b288cd2b85a', 1, 0.00, '', 1, NULL, NULL, '', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732545074/clients/144.png', NULL, '100%'),
	(145, 'Jonathan', 'Villarroel', 'guilad1233@gmail.com', '+591', '75946778', 'Jonathan - Villarroel', 'Bolivia', '$2b$10$Z3bIYqaitNdcoaQ0mrYBmOHtowmKwEXAehxsUK3YeVrFrap6JT07y', 20, 1, 19, 'Cliente', '2024-11-25 13:46:35', '2024-11-25 13:46:35', 1, '0d0bf76cec374dd70d10793b1b72e22cf21a58e3', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dpb4sg7pc/image/upload/v1732543762/clients/145.jpg', NULL, '100%'),
	(148, 'Alex', 'Bolivia', 'alexandercortezorias@gmail.com', '+591', '77563943', 'Alex - Bolivia', 'Bolivia', '$2b$10$PFIqFwS0FJRk9WXBhd3/nubei3r6toWNMbeKvILymDsQ0LcpU.3Nu', 32, 1, 16, 'Inversionista', '2024-11-25 13:56:40', '2024-11-25 13:56:40', 1, 'a424eccc2aa5ae8b7db969fc62509179a60d5da7', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732543840/clients/148.jpg', NULL, '100%'),
	(149, 'cliente', 'talento', 'cliente@gmail.com', '+591', '12121212', 'cliente - talento', 'Bolivia', '$2b$10$US35l7jTZVpP5vhw7PNbSuOBIof.L.g3UUUbekn4Jv6evpzAnlbqO', 24, 1, 19, 'Cliente', '2024-11-25 14:01:49', '2024-11-25 14:01:49', 1, 'a704ac94bc2049d06e79d25ee1f28307103b5026', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732544817/clients/149.png', NULL, '100%'),
	(150, 'admin', 'admin', 'admin@gmail.com', '+54', '78787878', 'admin - admin', 'Argentina', '$2b$10$oU7v/Jy9VexIh/N/7l1SH.YA.i6AMjJAMjw/T.3q1gXjny8cidlZy', 24, 1, 16, 'Admin', '2024-11-25 14:05:15', '2024-11-25 14:05:15', 1, 'bd0c7fa5f936eafedd68ffee0fa0f98d3875d647', 1, 0.00, '', 0, NULL, NULL, 'hombre', NULL, NULL, '0%'),
	(151, 'leandro', 'ledezma', 'lleandroledezma@gmail.com', '+591', '61814110', 'leandro - ledezma', 'Bolivia', '$2b$10$a5hn6r08RjbTR7XTuFTJYOGszBj0Pqk1JBVXCfK/DWo9OxxwKSkqu', 25, 1, NULL, 'Cliente', '2024-11-25 14:07:32', '2024-11-25 14:07:32', 1, 'f014ca117ed281b09269c6b33e276ba2a41ae9ac', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732545500/clients/151.jpg', NULL, '100%'),
	(152, 'Pedro', 'Olmos', 'pedro@gmail.com', '+54', '+1 (224) 414-8779', 'Pedro - Olmos', 'Peru', '$2b$10$tpGUZXl5Eao1C6TQeXSmz.1ZFzUEtladFjiXiY6vTkY0nJOlkKsDq', 29, 1, 16, 'Null', '2024-11-25 14:07:53', '2024-11-25 14:07:53', 1, '593d70c7856ec23f12b26f54ccc5f41a0ef07cfb', 1, 0.00, '', 0, NULL, NULL, '', NULL, NULL, '0%'),
	(153, 'torman', 'Guard', 'toromanguard@gmail.com', '+591', '77563936', 'torman - Guard', 'Bolivia', '$2b$10$CIsOFveerAkfK7zoS6zRE.u51ekOw7Ax19XidpesfHUQDw1VqUvgS', 58, 1, NULL, 'Cliente', '2024-11-25 14:42:03', '2024-11-25 14:42:03', 1, '771a9a8cff786cf8523ab0e451cce091015ddd18', 1, 0.00, '', 0, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732546795/clients/153.jpg', NULL, '80%'),
	(156, 'Gabriel', 'Vargas', 'gabrielgonzalovargas.8@gmail.com', '+506', '74174111', 'Gabriel - Vargas', 'Costa Rica', '$2b$10$.oPSu.6dzzecApuAx.X7P.WVr/ig3CUvZDC9RW3SYDnYNm8coFukq', 83, 1, 16, 'Cliente', '2024-11-25 20:00:27', '2024-11-25 20:00:27', 1, 'cd3c1220f8843a0175370d3121c90251c0df0a12', 1, 0.00, '', 0, 'c1267e5181f564bb40d1e39e32a93a6487d9b9ab', 1733116102036, 'hombre', NULL, NULL, '0%'),
	(157, 'Cristian ', 'Bolivia', 'andres.carvajal.garcia16@gmail.com', '+591', '79367210', 'Cristian  - Bolivia', 'Bolivia', '$2b$10$3loA4QeymniYzjLdw14ZIu271Wq3vp6h4fX8Fz2EWXhoMZUCbbzA.', 24, 1, 16, 'Null', '2024-11-26 13:36:18', '2024-11-26 13:36:18', 1, '9d96bad79acd93968c0c4c966072280f694e27d0', 1, 0.00, '', 0, NULL, NULL, 'hombre', NULL, NULL, '0%'),
	(158, 'Prueba', 'Usuario', 'prueba@test.com', '+54', '87654321', 'Prueba - Usuario', 'Argentina', '$2b$10$0.UWl9gt9./H6H1Ct2mFZO9M.Jlv3iXRX9A4s7WwF/boirB/Jsy42', 32, 1, 16, 'Null', '2024-11-26 14:22:38', '2024-11-26 14:22:38', 1, '47bbd44c0c95f6abd11c9e6c859ee6066af3fcde', 1, 0.00, '', 0, NULL, NULL, 'hombre', NULL, NULL, '0%'),
	(159, 'leo', 'leo', 'a@a.com', '+591', '12312312', 'leo - leo', 'Bolivia', '$2b$10$WRYG7bVLQi2seauoOCt9b.CItuakWZap.h.5E7HJJhlJajOUcTj2K', 19, 1, NULL, 'Cliente', '2024-11-26 14:46:50', '2024-11-26 14:46:50', 1, 'ddb090b067308aca2e3c5c693e496b743fa31efb', 1, 0.00, 'admin@gmail.com', 0, NULL, NULL, 'hombre', NULL, NULL, '60%'),
	(160, 'leo', 'leo', 'leo@gmail.com', '+54', '56565655', 'leo - leo', 'Argentina', '$2b$10$v2ElNMcWWIVb3dcsLlxdseLbKOUV8/bLumGraHhUlMGuSpOfDrL8O', 24, 1, 18, 'Inversionista', '2024-11-26 15:26:24', '2024-11-26 15:26:24', 1, 'ce14f633e841c7d6ded4dd0390b494f075fd507c', 1, 0.00, 'admin@gmail.com', 0, NULL, NULL, 'hombre', NULL, NULL, '50%'),
	(161, 'leo', 'leo', 'leo2@gmail.com', '+591', '23232323', 'leo - leo', 'Argentina', '$2b$10$7TLQh2qCq1WtbuD6pXVuE.0Yg.VdsFcjBWl4U2mKyXO18eKjxpADe', 24, 1, 19, 'Inversionista', '2024-11-26 15:29:10', '2024-11-26 15:29:10', 1, '4dfe917d6fdcae87a93aeef2c373e637501f3ba2', 1, 0.00, 'admin@gmail.com', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732635318/clients/161.png', NULL, '100%'),
	(162, 'ewq', 'weq', 's@gmail.com', '+591', '1234123456781234', 'ewq - weq', 'Bolivia', '$2b$10$wYTx4Nsj8SzHYYxkmqVEked2aLGsUoKHRFL2zBdon9Wwxl5kTr.hq', 24, 1, 16, 'Null', '2024-11-27 14:03:53', '2024-11-27 14:03:53', 1, '2f92d8bed33c2becb0d8c9e357f3083b4101dba5', 1, 0.00, 'admin@gmail.com', 0, NULL, NULL, 'mujer', NULL, NULL, '0%'),
	(163, 'eew', 'qwe', 'q@gmail.com', '+55', '20202020202', 'eew - qwe', 'Brazil', '$2b$10$uAv0U9NceK0jJwJ4jE3mN.CqzHuvy7YQnd6U13.NgHnR9BPO4b3Cy', 24, 1, 19, 'Null', '2024-11-27 14:23:33', '2024-11-27 14:23:33', 1, 'dec2c42ff4e17d45c44299abe6e5d1bd54d8b231', 1, 0.00, 'admin@gmail.com', 0, NULL, NULL, 'hombre', NULL, NULL, '0%'),
	(164, 'Ari', 'Dorado', 'a@gmail.com', '+1', '1479852', 'Ari - Dorado', 'Canada', '$2b$10$wWeaXqP0e2cKplJPhhunCeZzpsGRMSO.MJ8NUDLmIGZDpFANnoSa.', 23, 1, 19, 'Inversionista', '2024-11-27 14:33:23', '2024-11-27 14:33:23', 1, '71c9fdd7955332dde4b798430cd5e8eba1a9b702', 1, 0.00, 'admin@gmail.com', 0, NULL, NULL, 'hombre', NULL, NULL, '0%'),
	(165, 'Marvin Ramirez', 'Wiley', 'vujime@mailinator.com', '+591', '+1 (631) 169-7471', 'Marvin Ramirez - Wiley', 'Cuba', '$2b$10$u8kd/4vid7xyM/D8W/KCdOAxGyt.61QLxc36M9Ow.o3NkW4bCqRBy', 20, 1, 18, 'Null', '2024-11-27 20:46:53', '2024-11-27 20:46:53', 1, '5f13150d959ecd5665c3a122c6f4de1e5bca8d17', 1, 0.00, '', 0, NULL, NULL, 'mujer', NULL, NULL, '0%'),
	(166, 'luis', 'luis', 'joryorch5000@gmail.com', '+54', '12345678', 'luis - luis', 'Argentina', '$2b$10$x0tYSekcYuTPPYaApbRW4OK3s9DfHmNWcOaKIotm2NktVAWdTj8ae', 24, 1, 16, 'Cliente', '2024-11-27 20:58:18', '2024-11-27 20:58:18', 1, '9a2e7a85a5dbf1c2c992e3a302f3d1aa78a7d8d1', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1732741507/clients/166.png', NULL, '100%'),
	(167, 'Cristian Andres', 'Carvajal Garcia', 'andres-carvajal-garcia64@outlook.com', '+591', '68757882', 'Cristian Andres - Carvajal Garcia', 'Bolivia', '$2b$10$olLLW68MACyzhaQ95CsZh.iffKjggMRDKl2oGLTf6a4qly6osHiYi', 26, 1, 20, 'Cliente', '2024-11-28 21:33:55', '2024-11-28 21:33:55', 1, '6d45e9730a178d6aacc587c4f77293899c11d9c7', 1, 0.00, 'admin@gmail.com', 0, NULL, NULL, 'hombre', NULL, NULL, '0%'),
	(168, 'Rodrigo', 'Gandarillas Heredia', 'rodrigo.gandarillas.herediaaa@gmail.com', '+591', '76993789', 'Rodrigso - Gandarillas Heredisa', 'Bolivia', '$2b$10$6R.Caj3zru1NW7.uuOBpTOLLllSGYn5xcqQjk7RHp9uqu0UAR1r7a', 28, 1, 19, 'Cliente', '2024-12-11 20:34:54', '2024-12-11 20:34:54', 1, '5db5c3fab427d9f3f15696c048098fda9ef4cc17', 1, 0.00, '', 0, NULL, NULL, 'hombre', NULL, NULL, '20%'),
	(170, 'Rodrigo', 'Gandarillas Heredia', 'rodrigo.gandarillaas.heredia@gmail.com', '+591', '76993762', 'Rodrigo - Gandarillas Heredia', 'Bolivia', '$2b$10$jE81XG7prbHWUW4v0XoVre0seadbGfb2RL0KnifuXItW/mwoueR3a', 29, 1, 18, 'Cliente', '2024-12-13 14:31:04', '2024-12-13 14:31:04', 1, 'a413f0049d12b515289119c4474b2238bd78cc21', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1734100562/clients/170.jpg', NULL, '100%'),
	(171, 'Danny ', 'Gonzales Medina', 'dan9813gm@gmail.com', '+591', '60746302', 'Danny  - Gonzales Medina', 'Bolivia', '$2b$10$bmAenGiVHTgSPA46HPnT6.xCJe5hkbYkNBXb0bIHswU4AWe7p.6.W', 26, 1, 20, 'Cliente', '2024-12-16 15:26:12', '2024-12-16 15:26:12', 1, '73e0fccd6534b98f63163f305bfff733a9f1ff71', 1, 0.00, 'admin@gmail.com', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1734364323/clients/171.png', NULL, '100%'),
	(172, 'Bradley Wiggins', 'Haney', 'rkorodri@gmail.com', '+591', '+1 (717) 629-9067', 'Bradley Wiggins - Haney', 'Costa Rica', '$2b$10$Q/T0LweBqlqOxhX6bIi7Le9sZeP7HO/PGawKMcPfzbHzh2dTEHbH6', 52, 1, 16, 'Cliente', '2024-12-16 16:56:57', '2024-12-16 16:56:57', 1, '5019d2ce482ec486a617cf57ee6b999eda8bc32f', 1, 0.00, '', 0, NULL, NULL, '', NULL, NULL, '0%'),
	(173, 'Cecilia', 'Soruco', 'airamppo1@gmail.com', '+591', '68501530', 'Cecilia - Soruco', 'Bolivia', '$2b$10$WhnpfE49NL37RT.oYT/i2eTCmjkBI9/pFH4rX6YNGd.XwwNU3cO2u', 33, 1, 16, 'Inversionista', '2024-12-27 20:03:27', '2024-12-27 20:03:27', 1, '99b8289be5a915653119b3a37f0891e08befb0a3', 1, 0.00, '', 1, NULL, NULL, 'mujer', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1736088130/clients/173.jpg', NULL, '100%'),
	(174, 'Rodrigo', 'Gandarillas Heredia', 'rodri@gmail.com', '+591', '76993766', 'Rodrigo - Gandarillas Heredia', 'Bolivia', '$2b$10$8gRIzDZlvb2X8ouoNa0gy.SmXvI4vlGef6WHFZvclgc0bmCTZlQOW', 34, 1, 16, 'Cliente', '2025-02-04 15:42:42', '2025-02-04 15:42:42', 1, '71e1c1119e6ff57f88d212d67311cd12017a65e9', 1, 0.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1738685929/clients/174.png', NULL, '100%'),
	(175, 'Karen', 'GandarillasHeredia', 'inversor1@gmail.com', '+591', '63256746', 'Karen - GandarillasHeredia', 'Bolivia', '$2b$10$qL5LGCcrU1n7Vksh0GFUhu7eRL3O769eIs.YlJjncCRrk91VfkfxW', 21, 1, 16, 'Inversionista', '2025-02-04 15:45:14', '2025-02-04 15:45:14', 1, '5cc397fbcdccf8c92979e8e090a2b36deeda04e4', 1, 5000.00, '', 1, NULL, NULL, 'hombre', NULL, NULL, '100%'),
	(176, 'Ruth', 'Gandarillas Heredia', 'inversor2@gmail.com', '+591', '78569521', 'Ruth - Gandarillas Heredia', 'Bolivia', '$2b$10$8eYVW64QOV.5sa/wrBKQWuKvlJ88OxXASjtbZPhuQpkCfUQxthTqS', 24, 1, 16, 'Inversionista', '2025-02-04 15:46:07', '2025-02-04 15:46:07', 1, 'cf6511a65aecbba4b46fb8f00ba8c1fc890df587', 1, 5000.00, '', 1, NULL, NULL, 'hombre', 'https://res.cloudinary.com/dbvzafbum/image/upload/v1738685820/clients/176.jpg', NULL, '100%');

-- Volcando estructura para disparador railway.generar_plan_pagos_solicitud
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `generar_plan_pagos_solicitud` AFTER UPDATE ON `solicitudes_inversion` FOR EACH ROW BEGIN
    DECLARE v_monto_pago DECIMAL(10,2);
    DECLARE v_fecha_pago DATE;
    DECLARE i INT DEFAULT 1;
    DECLARE v_existe_plan INT;
    DECLARE v_inversion_id INT;
    
    -- Verificar si ya existe un plan de pagos
    SELECT COUNT(*) INTO v_existe_plan
    FROM plan_pagos
    WHERE solicitud_inv_id = NEW.id
    LIMIT 1;
    
    -- Obtener el ID de la inversión relacionada
    SELECT inversion_id INTO v_inversion_id
    FROM inversiones
    WHERE solicitud_inv_id = NEW.id
    LIMIT 1;
    
    -- Solo ejecutar si el estado cambió a 'Proceso' y no existe plan de pagos
    IF NEW.estado_inversion = 'Proceso' AND v_existe_plan = 0 THEN
        -- Actualizar la ganancia estimada en inversiones usando porcentaje_interes
        UPDATE inversiones 
        SET ganancia_estimada = (NEW.monto * NEW.porcentaje_interes / 100)
        WHERE inversion_id = v_inversion_id;
        
        -- Calcular monto por pago usando porcentaje_interes
        SET v_monto_pago = (NEW.monto + (NEW.monto * NEW.porcentaje_interes / 100)) / NEW.cantidad_pagos;
        
        -- Generar los pagos mensuales
        WHILE i <= NEW.cantidad_pagos DO
            SET v_fecha_pago = DATE_ADD(NEW.fecha_inicio_pago, INTERVAL (i-1) MONTH);
            
            INSERT INTO plan_pagos (
                solicitud_inv_id,
                cliente_id,
                num_pago,
                monto_pago,
                fecha_programada,
                estado_pago
            ) VALUES (
                NEW.id,
                NEW.cliente_id,
                i,
                v_monto_pago,
                v_fecha_pago,
                'Pendiente'
            );
            
            SET i = i + 1;
        END WHILE;
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
