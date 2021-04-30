import express, { response } from 'express';
import './database';
import { routes } from './routes';

const app = express();

app.use(express.json());

app.use(routes);

// app.get('/', (request, response) => {
//     return response.json({ "message": "Hello World!" })
// })

// app.post('/', (request, response) => {
//     return response.json({
//         "message": "Usuário Salvo com Sucesso",
//     });
// })

app.listen(3333, () => {
    console.log('App started at port 3333')
});