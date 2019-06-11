module.exports =  {
    server_port: process.env.PORT || 3000,
    database_name: process.env.DBNAME || "practicas",
    database_user: process.env.DBUSER || "practicas",
    database_password: process.env.DBPASS || "practicas",
    database_host: process.env.DBHOST || 'localhost',
    database_port: process.env.DBPORT || 3306,
    mail_user: process.env.MAIL_USER,
    mail_password: process.env.MAIL_PASSWORD,
    jwt_secret: process.env.JWT_SECRET || 'secret',
    limit_upload: process.env.LIMIT_UPLOAD || '5mb',
}