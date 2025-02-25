import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template.js'
import studentRoutes from './routes/student.routes.js'
import courseRoutes from './routes/course.routes.js'
import authRoutes from './routes/auth.routes.js'
//import devBundle from './devBundle' 
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();
const CURRENT_WORKING_DIR = process.cwd();
console.log(CURRENT_WORKING_DIR);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(CURRENT_WORKING_DIR, 'dist/app')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRoutes)
app.use('/', studentRoutes)
app.use('/', courseRoutes)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())
app.use((err, req, res, next) => {
if (err.name === 'UnauthorizedError') {
res.status(401).json({"error" : err.name + ": " + err.message}) 
}else if (err) {
res.status(400).json({"error" : err.name + ": " + err.message}) 
console.log(err)
} 
})
export default app