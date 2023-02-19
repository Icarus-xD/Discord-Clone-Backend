import express from 'express';
import Joi from 'joi';
import Validator from 'express-joi-validation';
import friendInvitationControllers from '../controllers/friendInvitation/friendInvitationControllers';

const auth = require('../middleware/auth');
// const friendInvitationControllers = require('../controllers/friendInvitation/friendInvitationControllers');

const router = express.Router();
const validator = Validator.createValidator({});

const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string().email(),
  user: Joi.object().required(),
});

const inviteDecisionSchema = Joi.object({
  id: Joi.string().required(),
  user: Joi.object().required(),
});

router.post(
  '/invite',
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.postInvite
);

router.post(
  '/accept',
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.postAccept
);

router.post(
  '/reject',
  auth,
  validator.body(inviteDecisionSchema),
  friendInvitationControllers.postReject
);

export default router;