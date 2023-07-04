import User from "../models/User.js";

export const uploadPicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(req.file)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Save the file path or URL to the user's profile picture field in the database
    user.picturePath = req.file.path; // Assuming you saved the file to the local filesystem

    // Save the updated user document
    await user.save();

    // Return the image URL in the response
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
