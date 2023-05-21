import Group from "../models/Group.js";
import User from "../models/User.js";

/* CREATE GROUP */

export const createGroup = async (req, res) => {
  try {
    //AICI LA USERS PASAM ARRAY DE ID-UL USERILOR
    const { ownerId, users, needs, urgency } = req.body;
    const newGroup = new Group({
      ownerId,
      users: users,
      needs: needs,
      urgency: urgency
    });

    await newGroup.save();

    //AICI SA VEZI CE RETURNEZI DUPA CE CREEZI UN GRUP
    const group = await Group.find();
    res.status(201).json(group);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */

export const getGroups = async (req, res) => {
  try{
    const group = await Group.find();
    res.status(200).json(group);
  }catch(err){
    res.status(404).json({ message: err.message });
  }
}

export const getUserGroup = async (req, res) => {
  try{
    const {ownerId} = req.params;
    const group = await Group.find({ownerId});
    res.status(200).json(group);
  }catch(err){
    res.status(404).json({ message: err.message });
  }
}
