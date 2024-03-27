const express=require('express')
const{
    getAllUsers,
    getUserById,
    deleteuser,
    updateUser,deleteAllUsers,
    updateUserPassword,showCurrentUser
}=require('../controller/usercontroller')
const {
  authenticateUser,
  authorizePermissions1,
} = require("../middelware/authentication");

const router=express.Router()
router.get('/getallusers',
authenticateUser,
 getAllUsers)
router.get("/getuserById/:id", authenticateUser, getUserById
);
router.post(
  "/delete/:id",
  [authenticateUser, authorizePermissions1("admin")],
  deleteuser
);
router.patch('/update',authenticateUser,updateUser)
router.patch(
  "/updateUserPassword",
  authenticateUser, 
  updateUserPassword
);

router.delete(
  "/deleteall",
  [authenticateUser, authorizePermissions1("admin")],
  deleteAllUsers
);
router.route('/showMe').get(authenticateUser, showCurrentUser);


module.exports=router