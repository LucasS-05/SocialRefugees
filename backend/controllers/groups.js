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
    res.status(201).json({ message: "group successfully created" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const deleteGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this group" });
    }
    await Group.findByIdAndRemove(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
// PUT
// Patch
export const updateGroup = async (req, res) => {
  try {
    console.log(req.params)
    const { groupId } = req.params
    const { needs, urgency, members } = req.body;

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
    const { groupId, userId, needs, description } = req.body;

    const group = await Group.findOne({ _id: groupId });

    if (group) {
      const existingUser = group.helpedBy.find((helpedUser) =>
        helpedUser.userId.toString() === userId &&
        helpedUser.needs.toString() === needs.toString()
      );

      if (existingUser) {
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
      });
    }
    res.status(200).json({ message: "group helpers updated successfully" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const setGroupAdmin = async (req, res) => {
  try {
    const { groupId, adminId } = req.body;
    console.log(groupId, adminId)

    const group = await Group.findById(groupId);
    if (group.administeredBy) {
      return res.status(409).json({ message: "Group already administered" });
    }

    await Group.findByIdAndUpdate(groupId, {
      administeredBy: adminId,
      urgency: "immediate"
    });
    res.status(200).json({ message: "group administrator updated successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

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
    res.status(200).json(group);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getAdministeredGroups = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId)
    const group = await Group.find({ administeredBy: userId });
    res.status(200).json(group);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getUnadministeredGroups = async (req, res) => {
  try {
    const group = await Group.find({ administeredBy: { $eq: null } });
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


// export const deleteUserFromGroup = async (req, res) => {
//   try {
//     const { ownerId, } = req.body;
//     const group = await Group.find({ ownerId });
//     res.status(200).json(group);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// }
