import type {Request, Response, NextFunction} from "express"

export function serverLogger(error : Error){
    console.error("Server Error: ", error.message, " : ", new Date().toLocaleDateString() + ":" + new Date().toLocaleTimeString())
}

export function visitedEndpointsLogger(req: Request, _: Response, next: NextFunction){
    console.log("Reqested Url: ", req.originalUrl, ": time : ", new Date().toLocaleDateString() + ":" + new Date().toLocaleTimeString())
    next()
}