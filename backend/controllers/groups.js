import Group from "../models/Group.js";
import User from "../models/User.js";

/* CREATE GROUP */

// POST
export const createGroup = async (req, res) => {
  try {
    console.log(req.body)
    const { ownerId, members, needs, urgency, ownerName, groupId } = req.body;
    const newGroup = new Group({
      ownerId,
      members: members,
      needs: needs,
      urgency: urgency
    });
    const pendingMembers = members.filter((member) => member.status === "pending");

    if (pendingMembers) pendingMembers.forEach(async (member) => {
      // Create a notification message
      const notificationMessage = "Ai un request sa intri in grup";

      // const existingNotification = await User.findOne({
      //   "notifications.groupId": groupId,
      // });

      // if (existingNotification) {
      //   res.status(409)
      //   console.log(`Skipping duplicate notification for user ${member.user} and group ${groupId}`);
      // }

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
    )
    else console.log("no notifications to be sent")


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

      // if (existingNotification) {
      //   res.status(409)
      //   console.log(`Skipping duplicate notification for user ${member.user} and group ${groupId}`);
      // }

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
    )
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
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is already a member of the group
    const isUserAlreadyMember = group.members.some(member => member.user.toString() === userId);

    if (isUserAlreadyMember) {
      return res.status(409).json({ message: "Deja ati trimis request" });
    }

    group.members.push({
      role: 'user',
      status: 'pending',
      user: userId,
    });

    await group.save();

    // Send a notification to the owner
    const owner = group.ownerId;
    const notificationMessage = 'Un utilizator vrea sa intre la tine in grup';

    owner.notifications.push({
      message: notificationMessage,
      notificationType: 'group_request',
      groupId: groupId,
      userId: userId,
    });

    await owner.save();

    res.status(200).json({ message: "Request trimis" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateMemberStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId, status, notificationId } = req.body;

    // Check if the notification status is already "read"
    const user = await User.findOne({ 'notifications.groupId': groupId, 'notifications._id': notificationId });

    if (user) {
      const notification = user.notifications.find(n => n._id.toString() === notificationId);

      if (notification && notification.status === 'read') {
        return res.status(200).json({ message: 'Already processed this request' });
      }
    }

    // Update the member's status in the group
    await Group.findOneAndUpdate(
      { _id: groupId, 'members.user': memberId },
      { $set: { 'members.$.status': status } }
    );

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
    console.log("askjdansfbjhbsgberj ebg", helpers)

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
      console.log("rejtbgiurtnbguitrngiurtgiurgniu", user)

      if (user) {
        const notificationMessage = `Un ONG a luat grupul pe care il poti ajuta in administrare. Te rog suna la ${admin.phone} pentru mai multe detalii`;
        user.notifications.push({
          message: notificationMessage,
          notificationType: "info",
          status: "read",
        });

        await user.save();
      }
    }

    // Send notification to all members of the group
    for (const member of group.members) {
      const user = await User.findById(member.user);

      if (user && !helpers.includes(member.user.toString())) {
        const notificationMessage = `Grupul a fost actualizat si este acum administrat de ${admin.name}.`;
        user.notifications.push({
          message: notificationMessage,
          notificationType: "info",
          status: "read",
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

export const checkUserBelongsToGroup = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find groups that have the user's ID in the members array
    const group = await Group.findOne({ "members.user": userId });
    console.log(group)

    if (group) {
      // Check if the user has the role "admin" in the group
      const isAdmin = group.members.some(member => member.user.toString() === userId && member.role === "admin");

      if (isAdmin) {
        // User is an admin in the group
        res.status(200).json({ group, isAdmin: true });
      } else {
        // User is not an admin in the group
        res.status(200).json({ group, isAdmin: false });
      }
    } else {
      // User does not belong to any group
      res.status(404).json({ message: "User does not belong to any group" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteUserFromGroup = async (req, res) => {
  try {
    const { userId } = req.params;
    const { groupId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const userIndex = group.members.findIndex(member => member.user.toString() === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found in the group" });
    }

    group.members.splice(userIndex, 1);

    await group.save();

    res.status(200).json({ message: "User successfully removed from the group" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id; // Assuming you're using authentication middleware

    // Find the user and delete the notification with the given ID
    const user = await User.findById(userId);
    user.notifications = user.notifications.filter(notification => notification._id.toString() !== notificationId);
    await user.save();

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
};
