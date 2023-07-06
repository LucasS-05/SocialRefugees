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
    res.status(201).json({ message: "Grup creat cu succes" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const deleteGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Grupul nu a fost gasit" });
    }
    if (group.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Nu ai permisiunile pentru a sterge acest grup" });
    }
    await Group.findByIdAndRemove(groupId);
    res.status(200).json({ message: "Grup sters cu succes" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
// PUT
// Patch
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params
    const { needs, urgency, members, ownerName } = req.body;

    await Group.findByIdAndUpdate(groupId, {
      needs: needs,
      urgency: urgency,
      members: members
    })
    const pendingMembers = members.filter((member) => member.status === "pending");

    if (pendingMembers) pendingMembers.forEach(async (member) => {
      // Create a notification message
      const notificationMessage = "Ai un request sa intri in grup";

      const existingNotification = await User.findOne({
        "notifications.groupId": groupId,
      });

      if (existingNotification) {
        res.status(409)
        console.log(`Skipping duplicate notification for user ${member.user} and group ${groupId}`);
      }

      else {
        // Update the user's notifications array with the new notification
        await User.findByIdAndUpdate(member.user, {
          $push: {
            notifications: {
              message: notificationMessage,
              notificationType: "group_invite",
              groupId: groupId,
              ownerName: ownerName,
            },
          },
        });
      }
    })
    else console.log("no notifications to be sent")

    res.status(200).json({ message: "Grup updatat cu succes" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const group = await Group.findById(groupId).populate('ownerId');

    if (!group) {
      return res.status(404).json({ message: '' });
    }

    group.members.push({
      role: 'user',
      status: 'pending',
      user: userId,
    });

    await group.save();

    // cend a notification to the owner
    const owner = group.ownerId;
    const notificationMessage = 'Un utilizator vrea sa intre la tine in grup';

    owner.notifications.push({
      message: notificationMessage,
      notificationType: 'group_request',
      groupId: groupId,
      userId: userId,
    });

    await owner.save();

  } catch (err) {
    console.log(err)
  }
}


export const updateMemberStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId, status, notificationId } = req.body;

    // Update the member's status in the group
    await Group.findOneAndUpdate(
      { _id: groupId, 'members.user': memberId },
      { $set: { 'members.$.status': status } }
    );

    const user = await User.findOne({ 'notifications.groupId': groupId, 'notifications._id': notificationId });


    // Set the notification status to "read" for the user
    if (user) {
      user.notifications.forEach((notification) => {
        if (notification._id.toString() === notificationId) {
          notification.status = 'read';
        }
      });
      await user.save();
    }

    res.status(200).json({ message: 'Ai intrat cu succes in grup' });
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
    res.status(200).json({ message: "Request-ul a fost trimis" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const setGroupAdmin = async (req, res) => {
  try {
    const { groupId, adminId, helpers } = req.body;
    console.log("uifneurbgyuebtvryurbtvrtbguybgtrubtguybgt", helpers)

    const group = await Group.findById(groupId);
    if (group.administeredBy) {
      return res.status(409).json({ message: "Grup deja administrat" });
    }

    await Group.findByIdAndUpdate(groupId, {
      administeredBy: adminId,
      urgency: "immediate"
    });

    const admin = await User.findById(adminId)
    for (const userId of helpers) {
      const user = await User.findById(userId);

      if (user) {
        const notificationMessage = `Un ONG a luat grupul pe care il poti ajuta in administrare. Te rog suna la ${admin.phone} pentru mai multe detalii`;
        user.notifications.push({
          message: notificationMessage,
          notificationType: "other",
          status: "read",
          groupId: groupId,
        });

        await user.save();
      }
    }

    res.status(200).json({ message: "administrator updatat cu succes" });
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
