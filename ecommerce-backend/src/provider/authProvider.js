const prisma = require('../prisma');
const jwt = require('jsonwebtoken');
const { generateOtp } = require('../utils/commonHelper')

const requestOtpProvider = async ({ phone }) => {
    try {
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await prisma.otp.create({
            data: {
                phone,
                code: otpCode,
                expiresAt,
            },
        });

        console.log(`OTP for ${phone}: ${otpCode}`); // Replace this with SMS service integration

        return {
            message: 'OTP sent successfully via SMS',
        };
    } catch (error) {
        console.error("Error in OTP Provider ::", error);
        throw error;
    }
};

const verifyOtpProvider = async ({ phone, code }) => {
    try {
        const otp = await prisma.otp.findFirst({
            where: { phone, code },
            orderBy: { createdAt: 'desc' },
        });

        if (!otp || otp.expiresAt < new Date()) {
            throw { message: 'Invalid or expired OTP' };
        }

        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
            user = await prisma.user.create({ data: { phone } });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        const profileIncomplete = !user.email || !user.name;

        return {
            token,
            user,
            message: 'OTP verified and user logged in successfully',
            profileIncomplete,
        };
    } catch (err) {
        console.error("Error in verifyOtpProvider:", err);
        throw err;
    }
};

const updateProfileProvider = async (userId, { name, email }) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, email }
        });

        return {
            message: 'Profile updated successfully',
            user: updatedUser
        };
    } catch (error) {
        console.error("Error in updateProfile Provider ::", error);
        throw error;
    }
};

module.exports = {
    requestOtpProvider,
    verifyOtpProvider,
    updateProfileProvider
}