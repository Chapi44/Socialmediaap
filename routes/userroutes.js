const express=require('express')
const{
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
}=require('../controller/usercontroller')
const {
  authenticateUser,
  authorizePermissions1,
} = require("../middelware/authentication");

const router=express.Router()
router.get('/getallusers',

 getAllUsers)
router.get("/getuserById/:id", getUserById
);
router.post(
  "/delete/:id",

  deleteUser
);
router.patch('/update', updateUser)
router.patch(
  "/updateUserPassword",
 
  updateUserPassword
);


router.route('/showMe').get(authenticateUser, showCurrentUser);


module.exports=router