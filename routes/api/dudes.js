const express = require('express');
const router = express.Router();
const {
  getAllDudes,
  getDude,
  addDude,
  updateDude,
  deleteDude,
} = require('../../controllers/dudesController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router
  .route('/')
  .get(getAllDudes)
  .post(verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor), addDude)
  .put(verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor), updateDude)
  .delete(verifyRoles(ROLES_LIST.admin), deleteDude);

router.route('/:id').get(getDude);

module.exports = router;
