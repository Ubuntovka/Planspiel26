import express, {raw, Request, Response} from 'express'
import {IUser} from '../../models/User'
import {
    loginUser,
    registerUser,
    updateUser,
    deleteUser
} from '../controllers/userController'
import auth, {CustomRequest} from '../../middleware/auth'

const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
    const userData: Partial<IUser> = {
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    }
    const registeredUser = await registerUser(userData)
    if (registeredUser.error) {
        return res.status(400).json({
            error: registeredUser.error,
        })
    }
    return res.status(201).json(registeredUser);
})

router.post('/login', async (req: Request, res: Response) => {
    const userData: Partial<IUser> = {
        email: req.body.email,
        password: req.body.password,
    }
    const loggedInUser = await loginUser(userData)
    if (loggedInUser?.error) {
        return res.status(400).json({
            error: loggedInUser.error,
        })
    }
    return res.status(200).json(loggedInUser)
})

// Fetch logged in user
router.get('/me', auth, async (req: CustomRequest, res: Response) => {
    return res.status(200).json(req.user)
})


router.patch('/update', auth, async (req: CustomRequest, res: Response) => {
    const body = (req as any).body || undefined

    if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Request body is missing or invalid JSON. Ensure Content-Type: application/json.' })
    }

    const updates: Partial<IUser> = {
        username: body.username,
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        pictureUrl: body.pictureUrl,
        preferredLanguage: body.preferredLanguage,
    }

    if (!req.user) {
        return res.status(401).json({error: 'Unauthorized'})
    }

    const result = await updateUser(req.user._id.toString(), body.oldPassword, updates)

    if (result.error) {
        return res.status(400).json({error: result.error})
    }

    return res.status(200).json({user: result.user})
})

router.delete('/delete', auth, async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const result = await deleteUser(req.user._id.toString());

    if (result.error) {
        return res.status(400).json({error: result.error});
    }

    return res.status(200).json({message: 'User deleted successfully.', user: result.user});
})


// Logout user
router.post('/logout', auth, async (req: CustomRequest, res: Response) => {
    if (req.user) {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        try {
            await req.user.save();
        } catch (err) {
            console.error('Failed to save user during logout:', err);
        }
    }
    return res.status(200).json({
        message: 'User logged out successfully.',
    })
})

// Logout user from all devices
router.post('/logoutall', auth, async (req: CustomRequest, res: Response) => {
    if (req.user) {
        req.user.tokens = []
        await req.user.save()
    }
    return res.status(200).json({
        message: 'User logged out from all devices successfully.',
    })
})


export default router