export const uploadPicture = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
  } catch (err) {
    console.log(err);
  }
};
