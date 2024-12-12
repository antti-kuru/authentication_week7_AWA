import { Request, Response, NextFunction } from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config()

interface userRequest extends Request {
    user?: JwtPayload
}


export const validateToken = (req: userRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1]

    if (!token) res.status(401).json({message: "Missing token"})

    try {
        if (token) {
            const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
            req.user = verified
            next()
        }

    } catch (error) {
        res.status(401).json({message: "error"})
    }
}