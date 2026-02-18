import User from '../../models/User'
import {IUser} from '../../models/User'

export const registerUser = async (user: Partial<IUser>) => {
    const {username, email, password, firstName, lastName} = user
    if (!email || !password || !firstName || !lastName) {
        return {
            error: 'Please provide all the required fields',
        }
    }
    if (password.length < 8) {
        return {error: 'Password must be at least 8 characters long'};
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return {
            error: 'User with that email already exists.',
        }
    }
    try {
        const newUser = new User({ email, password, firstName, lastName, username })
        await newUser.save()
        const token = await newUser.generateAuthToken()
        return {
            user: newUser,
            token,
        }
    } catch (err: any) {
        return { error: err.message || 'Failed to register user' }
    }
}

export const loginUser = async (user: Partial<IUser>) => {
    const {email, password} = user
    if (!email || !password) {
        return {
            error: 'Please provide all the required fields',
        }
    }
    const existingUser = await User.findByCredentials(email, password)
    if (!existingUser) {
        return { error: 'Invalid email or password' }
    }
    existingUser.lastLoginDate = new Date()
    await existingUser.save()
    const token = await existingUser.generateAuthToken()
    return {
        user: existingUser,
        token,
    }
}

export const updateUser = async (userId: string, oldPassword: string | undefined, updates: Partial<IUser>) => {
    const allowedUpdates = ['username', 'email', 'password', 'firstName', 'lastName', 'pictureUrl', 'preferredLanguage']
    const updateFields = Object.keys(updates)

    const user = await User.findById(userId)
    if (!user) {
        return {error: 'User not found.'}
    }

    // Determine if the request is trying to change the password
    const wantsPasswordChange = updateFields.includes('password') && typeof (updates as any).password === 'string' && (updates as any).password !== ''

    // Only require current password verification when changing the password
    if (wantsPasswordChange) {
        if (!oldPassword || oldPassword.trim() === '') {
            return { error: 'Please provide current password to change your password.' }
        }
        const isValid = await User.findByCredentials(user.email, oldPassword)
        if (!isValid) {
            return { error: 'Wrong password' }
        }
        const newPassword = (updates as any).password as string
        if (newPassword.length < 8) {
            return { error: 'Password must be at least 8 characters long' }
        }
    }

    let updated = false

    updateFields.forEach((field) => {
        const value = (updates as any)[field]
        if (allowedUpdates.includes(field) && value !== '' && value !== undefined) {
            ;(user as any)[field] = value
            updated = true
        }
    })

    if (!updated) {
        return {error: 'No data found.'}
    }

    await user.save()
    return {user}
}

export const deleteUser = async (userId: string) => {

    const user = await User.findById(userId)
    if (!user) {
        return {error: 'User not found.'}
    }

    await user.deleteOne();
    return {user}
}

// Public reset password by email (no auth). Intended for "Forgot password" flow without token.
// Note: In production, consider email verification tokens before allowing resets.
export const resetPasswordByEmail = async (email: string | undefined, newPassword: string | undefined) => {
    if (!email || !newPassword) {
        return { error: 'Please provide email and newPassword' }
    }
    if (newPassword.length < 8) {
        return { error: 'Password must be at least 8 characters long' }
    }
    const user = await User.findOne({ email })
    if (!user) {
        // Do not reveal that the email does not exist; return generic success to prevent enumeration
        return { message: 'If this email exists, the password has been reset.' }
    }
    user.password = newPassword as any
    await user.save()
    return { message: 'Password has been reset successfully.' }
}