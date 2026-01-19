import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, {IUser} from '../models/User'
import config from '../config/config'

export interface CustomRequest extends Request {
    user?: IUser
    token?: string
}

interface DecodedToken {
    _id: string
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return res.status(401).send({error: 'Authentication token missing'})
        }

        const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
        })

        if (!user) {
            return res.status(401).send({error: 'User not found or token invalid'})
        }

        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({error: 'Authentication failed.'})
    }
}

export default auth