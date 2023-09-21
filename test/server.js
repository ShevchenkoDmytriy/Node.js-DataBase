
const express = require('express');
const getConnection = require('./database');
const sql = require('mssql');


const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/data', async(req, res) =>{
    try{
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset)
    }catch (err){
        res.status(500).send(err.message);
    }
})


app.post('/users', async(req, res) =>{
    const age = req.body.Age;
    const name = req.body.Name;

    if(!age || !name)
    {
        return res.status(400).send('Age or Name are required')
    }


    try{

        const pool = await getConnection();
        const result = await pool.request()
        .input('age', sql.Int, age)
        .input('name', sql.NVarChar(100), name)
        .query('INSERT INTO Users (name, age) VALUES (@name, @age)');

        
        res.status(201).send('User added successfully');

    }catch(err)
    {
        res.status(500).send(err.message);
    }
    
});
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('id', sql.Int, userId)
        .query('DELETE FROM Users WHERE id = @id');
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, age } = req.body;
  
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and Age are required' });
    }
  
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('id', sql.Int, userId)
        .input('name', sql.NVarChar(100), name)
        .input('age', sql.Int, age)
        .query('UPDATE Users SET name = @name, age = @age WHERE id = @id');
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})