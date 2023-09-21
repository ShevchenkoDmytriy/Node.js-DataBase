// npm install express mssql установка пакета работы с SQL



const sql = require('mssql')

const config = {
    user:'Test',
    password: '12345',
    server: 'HOME-PC',
    database: 'adonetdb',
    port:1443,
    options:{
        encrypt: false,
        trustedConnection: true
    }
}

async function getConnection()
{
    try{
        const pool = await sql.connect(config);
        return pool;
    }catch(err)
    {
        console.error('Database connection failed!', err);
    }
}



module.exports = getConnection;