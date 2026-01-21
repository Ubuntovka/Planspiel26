import express, {raw, Request, Response} from 'express'
import {IUser} from '../../models/User'
import {
    loginUser,
    registerUser,
    updateUser,
    deleteUser
} from '../controllers/userController'
import auth, {CustomRequest} from '../../middleware/auth'
import {OAuth2Client} from 'google-auth-library'
import config from '../../config/config'
import crypto from 'crypto'

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

// Google OAuth login/signup
router.post('/oauth/google', async (req: Request, res: Response) => {
    try {
        const idToken = req.body.idToken as string | undefined
        if (!idToken) {
            return res.status(400).json({ error: 'Missing idToken' })
        }

        const client = new OAuth2Client(config.googleClientId)
        const ticket = await client.verifyIdToken({ idToken, audience: config.googleClientId })
        const payload = ticket.getPayload()
        if (!payload) {
            return res.status(401).json({ error: 'Invalid Google token' })
        }

        const email = payload.email || ''
        const emailVerified = payload.email_verified
        const firstName = (payload.given_name || '').trim()
        const lastName = (payload.family_name || '').trim()
        const pictureUrl = payload.picture || null

        if (!email || !emailVerified) {
            return res.status(401).json({ error: 'Google account email not verified' })
        }
        if (!firstName || !lastName) {
            return res.status(400).json({ error: 'Missing name in Google profile' })
        }

        // Find or create user
        let user = await (await import('../../models/User')).default.findOne({ email })
        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex')
            const UserModel = (await import('../../models/User')).default
            user = new UserModel({ email, firstName, lastName, password: randomPassword, pictureUrl }) as any
        } else {
            // Update basic profile fields if changed
            let changed = false
            if (user.firstName !== firstName) { (user as any).firstName = firstName; changed = true }
            if (user.lastName !== lastName) { (user as any).lastName = lastName; changed = true }
            if (pictureUrl && user.pictureUrl !== pictureUrl) { (user as any).pictureUrl = pictureUrl; changed = true }
            if (changed) { await user.save() }
        }

        ;(user as any).lastLoginDate = new Date()
        await (user as any).save()
        const token = await (user as any).generateAuthToken()
        return res.status(200).json({ user, token })
    } catch (err: any) {
        console.error('Google OAuth error:', err)
        return res.status(500).json({ error: 'Failed to authenticate with Google' })
    }
})

// Google OAuth Authorization Code (popup) exchange endpoint
router.post('/oauth/google/code', async (req: Request, res: Response) => {
    try {
        const code = req.body.code as string | undefined
        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' })
        }

        const client = new OAuth2Client({
            clientId: config.googleClientId,
            clientSecret: config.googleClientSecret,
            redirectUri: config.googleRedirectUri,
        })

        // Exchange code for tokens
        const { tokens } = await client.getToken({ code, redirect_uri: config.googleRedirectUri })
        if (!tokens || !tokens.id_token) {
            return res.status(401).json({ error: 'Failed to exchange code for tokens' })
        }

        // Verify ID token
        const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: config.googleClientId })
        const payload = ticket.getPayload()
        if (!payload) {
            return res.status(401).json({ error: 'Invalid Google token' })
        }

        const email = payload.email || ''
        const emailVerified = payload.email_verified
        const firstName = (payload.given_name || '').trim()
        const lastName = (payload.family_name || '').trim()
        const pictureUrl = payload.picture || null

        if (!email || !emailVerified) {
            return res.status(401).json({ error: 'Google account email not verified' })
        }
        if (!firstName || !lastName) {
            return res.status(400).json({ error: 'Missing name in Google profile' })
        }

        // Find or create user
        let user = await (await import('../../models/User')).default.findOne({ email })
        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex')
            const UserModel = (await import('../../models/User')).default
            user = new UserModel({ email, firstName, lastName, password: randomPassword, pictureUrl }) as any
        } else {
            // Update profile fields if changed
            let changed = false
            if (user.firstName !== firstName) { (user as any).firstName = firstName; changed = true }
            if (user.lastName !== lastName) { (user as any).lastName = lastName; changed = true }
            if (pictureUrl && user.pictureUrl !== pictureUrl) { (user as any).pictureUrl = pictureUrl; changed = true }
            if (changed) { await user.save() }
        }

        ;(user as any).lastLoginDate = new Date()
        await (user as any).save()
        const token = await (user as any).generateAuthToken()
        return res.status(200).json({ user, token })
    } catch (err: any) {
        console.error('Google OAuth code exchange error:', err)
        return res.status(500).json({ error: 'Failed to authenticate with Google (code flow)' })
    }
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