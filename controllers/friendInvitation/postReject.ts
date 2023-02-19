import { Request, Response } from 'express';
import { updateFriendsPendingInvitations } from '../../socketHandlers/updates/friends';

const FriendInvitation = require('../../models/friendInvitation');

const postReject = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { userId } = req.body.user;

    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    updateFriendsPendingInvitations(userId);

    return res.status(200).send('Invitation successfully rejected');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong please try again');
  }
};

export default postReject;