import User from "../models/User.js";

// 🔥 UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, email, password } = req.body;

    // ✅ EMAIL DUPLICATE CHECK
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // ✅ Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    // ⚠️ Password hash model karega
    if (password && password.trim() !== "") {
      user.password = password;
    }

    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });

  } catch (err) {
    console.error("Update Profile Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};