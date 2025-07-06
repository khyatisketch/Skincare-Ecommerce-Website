const prisma = require('../prisma');
const jwt = require('jsonwebtoken');
const { generateOtp } = require('../utils/commonHelper')
const axios = require('axios');

const requestOtpProvider = async ({ phone }) => {
    try {
        const response = await axios.get(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/+91${phone}/LOGIIN`
        );

        const data = response.data;

        if (data.Status !== 'Success') {
            throw new Error('Failed to send OTP via 2Factor');
        }

        return {
            message: 'OTP sent successfully via 2Factor SMS',
            sessionId: data.Details,  // This is the session ID used for verifying OTP
        };
    } catch (error) {
        console.error("Error in 2Factor OTP Provider ::", error);
        throw { message: 'Failed to send OTP' };
    }
};

const verifyOtpProvider = async ({ phone, code, sessionId }) => {
    try {
        const response = await axios.get(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${code}`
        );

        const data = response.data;

        if (data.Status !== 'Success') {
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
        console.error("Error in verifyOtpProvider (2Factor):", err);
        throw err;
    }
};


const updateProfileProvider = async (userId, { name, email, profileImageUrl }) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          ...(profileImageUrl && { profileImageUrl }) // ✅ only update if provided
        }
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

  const getUserProvider = async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImageUrl: true,
        role: true
      }
    })
  
    if (!user) throw { message: 'User not found' }
  
    return user
  }

  const subscribeProvider = async ({ email }) => {
    try {
        // Check if already subscribed
        const existing = await prisma.newsletter.findUnique({
            where: { email },
        });

        if (existing) {
            return {
                message: 'Email already subscribed',
            };
        }

        await prisma.newsletter.create({
            data: { email },
        });

        return {
            message: 'Successfully subscribed to newsletter',
        };

    } catch (error) {
        console.error("Error in Newsletter Provider ::", error);
        throw error;
    }
};
  
module.exports = {
    requestOtpProvider,
    verifyOtpProvider,
    updateProfileProvider,
    getUserProvider
}