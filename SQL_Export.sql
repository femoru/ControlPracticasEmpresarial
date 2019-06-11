-- MySQL dump 10.13  Distrib 5.7.14, for Linux (x86_64)
--
-- Host: localhost    Database: mysql
-- ------------------------------------------------------
-- Server version	5.7.14-google-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `practicas`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `practicas` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `practicas`;

--
-- Table structure for table `CARRERAS`
--

DROP TABLE IF EXISTS `CARRERAS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CARRERAS` (
  `ID_CARRERA` int(11) NOT NULL AUTO_INCREMENT,
  `ID_UNIVERSIDAD` int(11) NOT NULL,
  `CARRERA` varchar(45) DEFAULT NULL,
  `CODIGO` varchar(45) DEFAULT NULL,
  `DIRECTOR` varchar(200) DEFAULT NULL,
  `ASIGNATURA` varchar(45) NOT NULL,
  `TUTOR` varchar(200) DEFAULT NULL,
  `CREDITOS` tinyint(3) NOT NULL,
  `HORAS` tinyint(3) NOT NULL,
  `CUPOS` tinyint(3) NOT NULL,
  PRIMARY KEY (`ID_CARRERA`),
  KEY `fk_CARRERAS_UNIVERSIDADES1_idx` (`ID_UNIVERSIDAD`),
  CONSTRAINT `fk_CARRERAS_UNIVERSIDADES1` FOREIGN KEY (`ID_UNIVERSIDAD`) REFERENCES `UNIVERSIDADES` (`ID_UNIVERSIDAD`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ROLES`
--

DROP TABLE IF EXISTS `ROLES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ROLES` (
  `ID_ROL` int(11) NOT NULL AUTO_INCREMENT,
  `ROL` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_ROL`),
  UNIQUE KEY `ROL_UNIQUE` (`ROL`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ROLES`
--

LOCK TABLES `ROLES` WRITE;
/*!40000 ALTER TABLE `ROLES` DISABLE KEYS */;
INSERT INTO `ROLES` VALUES (1,'ADMINISTRADOR'),(2,'COORDINADOR'),(4,'ESTUDIANTE'),(3,'TUTOR');
/*!40000 ALTER TABLE `ROLES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UNIVERSIDADES`
--

DROP TABLE IF EXISTS `UNIVERSIDADES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UNIVERSIDADES` (
  `ID_UNIVERSIDAD` int(11) NOT NULL AUTO_INCREMENT,
  `RAZON_SOCIAL` varchar(200) NOT NULL,
  `NIT` varchar(45) NOT NULL,
  `REPRESENTANTE` varchar(45) NOT NULL,
  `CORREO` varchar(45) NOT NULL,
  `TELEFONOS` varchar(45) NOT NULL,
  `DIRECCION` varchar(45) NOT NULL,
  `FECHA_CREACION` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ESTADO` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID_UNIVERSIDAD`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USUARIOS`
--

DROP TABLE IF EXISTS `USUARIOS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USUARIOS` (
  `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT,
  `USUARIO` varchar(45) NOT NULL,
  `PASSWORD` varchar(64) NOT NULL,
  `ID_ROL` int(11) NOT NULL,
  `NOMBRE` varchar(200) NOT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT '1',
  `CORREO` varchar(200) DEFAULT NULL,
  `ID_UNIVERSIDAD` int(11) DEFAULT NULL,
  `CODIGO` varchar(15) DEFAULT NULL,
  `TIPODOCUMENTO` varchar(2) DEFAULT NULL,
  `NRODOCUMENTO` varchar(15) DEFAULT NULL,
  `TELEFONO` varchar(25) DEFAULT NULL,
  `ID_CARRERA` int(11) DEFAULT NULL,
  `SEMESTRE` tinyint(2) DEFAULT NULL,
  `PERIODO` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `USUARIO_UNIQUE` (`USUARIO`),
  KEY `fk_USUARIOS_ROLES_idx` (`ID_ROL`),
  KEY `fk_USUARIOS_UNIVERSIDADES_idx` (`ID_UNIVERSIDAD`),
  CONSTRAINT `fk_USUARIOS_ROLES` FOREIGN KEY (`ID_ROL`) REFERENCES `ROLES` (`ID_ROL`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIOS`
--

LOCK TABLES `USUARIOS` WRITE;
/*!40000 ALTER TABLE `USUARIOS` DISABLE KEYS */;
INSERT INTO `USUARIOS` VALUES (1,'cosorio@unicatolica.edu.co','13a5c202e320d0bf9bb2c6e2c7cf380a6f7de5d392509fee260b809c893ff2f9',1,'ADMINISTRADOR SISTEMAS',1,'cosorio@unicatolica.edu.co',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `USUARIOS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actainicio`
--

DROP TABLE IF EXISTS `actainicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actainicio` (
  `idactainicio` int(11) NOT NULL AUTO_INCREMENT,
  `idestudiante` int(11) NOT NULL,
  `perfil` text NOT NULL,
  `horario` varchar(200) NOT NULL,
  `modalidad` varchar(45) NOT NULL,
  `escenario` varchar(45) NOT NULL,
  `eps` varchar(200) NOT NULL,
  `arl` smallint(6) NOT NULL DEFAULT '0',
  `nitempresa` varchar(45) DEFAULT NULL,
  `nombreempresa` varchar(45) DEFAULT NULL,
  `telefonoempresa` varchar(45) DEFAULT NULL,
  `direccionempresa` varchar(45) DEFAULT NULL,
  `correoempresa` varchar(45) DEFAULT NULL,
  `sectoreconomico` varchar(45) DEFAULT NULL,
  `representantelegal` varchar(45) DEFAULT NULL,
  `documentorepresentante` varchar(45) DEFAULT NULL,
  `nombrejefe` varchar(45) DEFAULT NULL,
  `documentojefe` varchar(45) DEFAULT NULL,
  `telefonosjefe` varchar(45) DEFAULT NULL,
  `cargojefe` varchar(45) DEFAULT NULL,
  `profesionjefe` varchar(45) DEFAULT NULL,
  `correojefe` varchar(45) DEFAULT NULL,
  `funciones` text,
  `fechainicio` timestamp NULL DEFAULT NULL,
  `fechafinal` timestamp NULL DEFAULT NULL,
  `horariopractica` varchar(45) DEFAULT NULL,
  `totalhoras` varchar(45) DEFAULT NULL,
  `diaspracticas` varchar(53) DEFAULT NULL,
  PRIMARY KEY (`idactainicio`),
  KEY `fk_actainicio_idx` (`idestudiante`),
  CONSTRAINT `fk_actainicio` FOREIGN KEY (`idestudiante`) REFERENCES `USUARIOS` (`ID_USUARIO`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `actividades`
--

DROP TABLE IF EXISTS `actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividades` (
  `idactividad` int(11) NOT NULL AUTO_INCREMENT,
  `idestudiante` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `inicio` datetime NOT NULL,
  `fin` datetime NOT NULL,
  `duracion` int(11) NOT NULL,
  PRIMARY KEY (`idactividad`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `evaluacion`
--

DROP TABLE IF EXISTS `evaluacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluacion` (
  `idevaluacion` int(11) NOT NULL AUTO_INCREMENT,
  `idestudiante` int(11) NOT NULL,
  `idautor` int(11) DEFAULT NULL,
  `personal1` decimal(3,2) DEFAULT NULL,
  `personal2` decimal(3,2) DEFAULT NULL,
  `personal3` decimal(3,2) DEFAULT NULL,
  `personal4` decimal(3,2) DEFAULT NULL,
  `personal5` decimal(3,2) DEFAULT NULL,
  `laboral1` decimal(3,2) DEFAULT NULL,
  `laboral2` decimal(3,2) DEFAULT NULL,
  `laboral3` decimal(3,2) DEFAULT NULL,
  `laboral4` decimal(3,2) DEFAULT NULL,
  `laboral5` decimal(3,2) DEFAULT NULL,
  `laboral6` decimal(3,2) DEFAULT NULL,
  `comentario` text,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idevaluacion`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `evolucion`
--

DROP TABLE IF EXISTS `evolucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evolucion` (
  `idevolucion` int(11) NOT NULL AUTO_INCREMENT,
  `idestudiante` int(11) NOT NULL,
  `idautor` varchar(45) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comentario` text NOT NULL,
  `stars` smallint(6) NOT NULL DEFAULT '3',
  PRIMARY KEY (`idevolucion`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fichaproblema`
--

DROP TABLE IF EXISTS `fichaproblema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fichaproblema` (
  `idfichaproblema` int(11) NOT NULL AUTO_INCREMENT,
  `idestudiante` int(11) NOT NULL,
  `empresa` varchar(200) NOT NULL,
  `jefe` varchar(100) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `proyecto` varchar(200) NOT NULL,
  `planteamiento` text NOT NULL,
  `alcance` text NOT NULL,
  PRIMARY KEY (`idfichaproblema`),
  KEY `fk_fichaproblema_idx` (`idestudiante`),
  CONSTRAINT `fk_fichaproblema` FOREIGN KEY (`idestudiante`) REFERENCES `USUARIOS` (`ID_USUARIO`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inducciones`
--

DROP TABLE IF EXISTS `inducciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inducciones` (
  `idinduccion` int(11) NOT NULL AUTO_INCREMENT,
  `idcarrera` int(11) NOT NULL,
  `titulo` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `orden` smallint(6) NOT NULL,
  PRIMARY KEY (`idinduccion`),
  KEY `fk_inducciones_1_idx` (`idcarrera`),
  CONSTRAINT `fk_inducciones_1` FOREIGN KEY (`idcarrera`) REFERENCES `CARRERAS` (`ID_CARRERA`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-11 15:55:41
