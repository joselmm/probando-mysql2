import  express from 'express';
import  mysql from 'mysql2/promise';
import  cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());



app.post('/', async (req, res) => {
  const { mySqlSentence } = req.body;

  const responseObject = { noError: true, results: "" };
var connection;
  try {
     connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    const results = await connection.query(mySqlSentence);
  if (mySqlSentence.trim().startsWith('SELECT')) {

    responseObject.results = results[0];
  }else{
    
    
    responseObject.results = results;
  }

    res.json(responseObject);
  } catch (err) {
    responseObject.noError = false;
    responseObject.errorMessage = err.message;
    res.json(responseObject);
  }finally{
    connection.end();
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
