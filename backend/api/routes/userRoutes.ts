import express, {Request, Response} from 'express'
import {IUser} from '../../models/User'
import {
    loginUser,
    registerUser,
    updateUser,
    deleteUser,
    resetPasswordByEmail,
} from '../controllers/userController'
import auth, {CustomRequest} from '../../middleware/auth'
import {OAuth2Client} from 'google-auth-library'
import config from '../../config/config'
import crypto from 'crypto'

const router = express.Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         pictureUrl:
 *           type: string
 *           nullable: true
 *         preferredLanguage:
 *           type: string
 *           example: en
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required: [username, email, firstName, lastName, password]
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         password:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     GoogleOAuthRequest:
 *       type: object
 *       required: [idToken]
 *       properties:
 *         idToken:
 *           type: string
 *     GoogleCodeRequest:
 *       type: object
 *       required: [code]
 *       properties:
 *         code:
 *           type: string
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           description: New password; requires oldPassword to be set
 *         oldPassword:
 *           type: string
 *           description: Current password, required when changing password
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         pictureUrl:
 *           type: string
 *         preferredLanguage:
 *           type: string
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, firstName, lastName, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 */
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

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log in a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
/**
 * @openapi
 * /api/users/oauth/google:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login or signup via Google OAuth ID token
 *     description: Verifies a Google ID token and returns an auth token and user profile. Creates a new user if none exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleOAuthRequest'
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing or invalid ID token / profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid Google token or unverified email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during Google auth
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
/**
 * @openapi
 * /api/users/oauth/google/code:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login or signup via Google OAuth authorization code
 *     description: Exchanges a Google authorization code for tokens, verifies the ID token, then returns an auth token and user profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleCodeRequest'
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing or invalid authorization code / profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid Google token or unverified email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error during Google auth (code flow)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', auth, async (req: CustomRequest, res: Response) => {
    return res.status(200).json(req.user)
})


/**
 * @openapi
 * /api/users/update:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update current user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or password change error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @openapi
 * /api/users/delete:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete current user's account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Deletion error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log out current user (current device)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
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
/**
 * @openapi
 * /api/users/logoutall:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log out current user from all devices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
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

/**
 * Public: Reset password by email (no auth). Intended for "Forgot password" flow.
 */
router.post('/reset-password', async (req: Request, res: Response) => {
    const { email, newPassword } = req.body || {}
    const result = await resetPasswordByEmail(email, newPassword)
    if ((result as any).error) {
        return res.status(400).send(result)
    }
    return res.send(result)
})