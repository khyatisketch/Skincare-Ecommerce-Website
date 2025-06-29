const authValidator = require('../validator/authValidator');
const authProvider = require('../provider/authProvider');
const messages = require('../config/messages');

const requestOtp = async (req, res) => {
    try {
        console.log("OTP Controller logic :::");

        if (!req.body) {
            return _handleResponse(req, res, messages.error.REQ_BODY_EMPTY);
        }

        const validatedData = await authValidator.otpValidatorObj(req.body);
        const result = await authProvider.requestOtpProvider(validatedData);

        return _handleResponse(req, res, null, result, result.message);

    } catch (err) {
        console.error("Error in OTP Controller :: ", err);
        return _handleResponse(req, res, err);
    }
};

const verifyOtp = async (req, res) => {
    try {
        if (!req.body) {
            return _handleResponse(req, res, { message: 'Request body is empty' });
        }

        const validatedData = await authValidator.verifyOtpValidatorObj(req.body);
        const verifyOtpResult = await authProvider.verifyOtpProvider(validatedData);

        return _handleResponse(req, res, null, verifyOtpResult, verifyOtpResult.message);
    } catch (err) {
        console.error("Error in verifyOtpController:", err);
        return _handleResponse(req, res, err);
    }
};

const updateProfile = async (req, res) => {
    try {
      const { name, email } = req.body;
  
      if (!name || !email) {
        return _handleResponse(req, res, { error: 'Name and Email are required' });
      }
  
      // If file was uploaded, get its path
      const profileImageUrl = req.file?.path;
  
      const validatedData = await authValidator.updateProfileValidator({
        name,
        email,
        profileImageUrl,
      });
  
      const userId = req.user.id;
      const result = await authProvider.updateProfileProvider(userId, validatedData);
  
      return _handleResponse(req, res, null, result, result.message);
    } catch (error) {
      console.error("Error in updateProfile Controller :: ", error);
      return _handleResponse(req, res, error);
    }
  };
  

module.exports = {
    requestOtp,
    verifyOtp,
    updateProfile
}