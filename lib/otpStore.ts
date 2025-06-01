interface OtpData {
    otp: string;
    email: string;
    username: string;
    expiresAt: number; // Timestamp
  }
  
  // In-memory store for OTPs.
  // IMPORTANT: This is NOT suitable for production.
  // OTPs will be lost on server restart and it's not scalable.
  // For production, use a database (e.g., a separate OTP collection or Redis).
  export const registrationOtpStore: Record<string, OtpData> = {};
  
  const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  export const storeOtp = (email: string, username: string, otp: string): void => {
    const expiresAt = Date.now() + OTP_EXPIRY_DURATION;
    registrationOtpStore[email] = { email, username, otp, expiresAt };
    console.log(`OTP stored for ${email}: ${otp}, expires at ${new Date(expiresAt).toLocaleTimeString()}`);
  
    // Optional: Clean up expired OTPs periodically (not implemented here for simplicity)
    // This is important to prevent memory leaks in a long-running server.
  };
  
  export const retrieveOtp = (email: string): OtpData | undefined => {
    const entry = registrationOtpStore[email];
    if (entry) {
      console.log(`OTP retrieved for ${email}: ${entry.otp}, stored expiry ${new Date(entry.expiresAt).toLocaleTimeString()}, current time ${new Date(Date.now()).toLocaleTimeString()}`);
    } else {
      console.log(`No OTP found for ${email}`);
    }
    return entry;
  };
  
  export const deleteOtp = (email: string): void => {
    delete registrationOtpStore[email];
    console.log(`OTP deleted for ${email}`);
  };
  
  export const generateOtp = (length: number = 6): string => {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  };