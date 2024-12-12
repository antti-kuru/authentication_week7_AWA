import {Request, Response, Router} from "express"
import {body, Result, ValidationError, validationResult} from "express-validator"
import bcrypt from "bcrypt"
import jwt, {JwtPayload} from "jsonwebtoken"
import {validateToken} from "../middleware/validateToken"


const router : Router = Router()


interface IUser {
    email: string,
    password: string
}

const users: IUser[] = []



router.post("/api/user/register", 
    body("email").trim().isLength({min: 3}).escape(),
    body("password").isLength({min: 5}),

    async (req: Request, res: Response) => {

    try {
       
        const existingUser: IUser | undefined = users.find(user => user.email === req.body.email)

        if (existingUser) {
            res.status(403).json({message: "Error registering"})
        }
        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        const newUser: IUser = {
            email: req.body.email,
            password: hash
        }

        console.log(newUser)
        users.push(newUser)
        console.log("User created succesfully")
        res.status(200).json(newUser)

        console.log(users)
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
        console.log(error)
    }
})


router.get("/api/user/list", (req: Request, res: Response) => {
    try {
        if (users.length < 1) {
            res.status(403).json({message: "No users"})
            return
        }
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
})

router.post("/api/user/login", 
    body("email").trim().escape(),
    body("password").escape(),
    
    async (req: Request, res: Response) => {

        try {
            const existingUser: IUser | undefined = users.find(user => user.email === req.body.email)

        if (!existingUser) {
            res.status(403).json({message: "Error logging in"})
        } else {
        if (bcrypt.compareSync(req.body.password, existingUser.password)) {
            const jwtPayload: JwtPayload = {
                email: existingUser.email
            }
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "10m"})

            res.status(200).json({success: true, token})
            } else {
            res.status(401).json({message: "Login failed"}) }
        }


        } catch (error) {
            res.status(500).json({message: "Internal server error"})
            console.log(error)
        }

} )




router.get("/api/private", validateToken, (req: Request, res: Response) => {
        res.status(200).json({message: "This is protected secure route!"})
        
})











export default router