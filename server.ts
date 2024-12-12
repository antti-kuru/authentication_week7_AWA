import  express, {Express, Router} from "express"
import path from "path"
import morgan from "morgan"
import router from "./src/routes/app"
import dotenv from "dotenv"


dotenv.config()
const app: Express = express()
const PORT: number = 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))


app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




