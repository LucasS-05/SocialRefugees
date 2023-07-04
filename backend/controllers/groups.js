import Group from "../models/Group.js";
import User from "../models/User.js";

/* CREATE GROUP */

// POST
export const createGroup = async (req, res) => {
  try {
    console.log(req.body)
    const { ownerId, members, needs, urgency } = req.body;
    const newGroup = new Group({
      ownerId,
      members: members,
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

// PUT
// Patch
export const updateGroup = async (req, res) => {
  try {
    console.log(req.params)
    const { groupId } = req.params
    const { needs, urgency, members } = req.body;

    // //dont allow duplicates
    // const group = await Group.findOne({ _id: groupId });
    // if (group) {
    //   return res.status(409).json({ error: "Duplicate entry forbidden" });
    // }

    await Group.findByIdAndUpdate(groupId, {
      needs: needs,
      urgency: urgency,
      members: members
    })
    res.status(200).json({ message: "group updated successfully" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const addGroupHelper = async (req, res) => {
  try {
    // get the id of the group and append to the "helpedBy" the needs, the userId and description
    console.log(req.body)
    const { groupId, userId, needs, description } = req.body;

    //dont allow duplicates
    const group = await Group.findOne({ _id: groupId, "helpedBy.needs": needs, "helpedBy.description": description });
    if (group) {
      return res.status(409).json({ error: "Duplicate entry forbidden" });
    }

    await Group.findByIdAndUpdate(groupId, {
      $push: {
        helpedBy: {
          userId: userId,
          needs: needs,
          description: description,
        }
      }
    })
    res.status(200).json({ message: "group helpers updated successfully" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getBucket = async (req, res) => {
  try {
    const group = await Group.find({ administeredBy: null });
    res.status(200).json(group);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getGroups = async (req, res) => {
  try {
    const group = await Group.find();
    group.filter((e) => { return e.administeredBy > 0 })
    res.status(200).json(group);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}


export const getGroupAdmin = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const group = await Group.find({ ownerId });
    res.status(200).json(group);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const deleteUserFromGroup = async (req, res) => {
  try {
    const { ownerId, } = req.body;
    const group = await Group.find({ ownerId });
    res.status(200).json(group);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
