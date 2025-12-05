import { Router } from "express";
import { deleteSpecificUser, getSpecificUserCard, getSpecificUserDetails, specificUserDetails, updateUserDetails, updateUserPassword } from "./controller.js";
import { createUser } from "./manageUser.js";



const router=Router()
//  USER ROUTE
router.get("/my",getSpecificUserDetails)
router.patch("/:id",updateUserPassword)
// ADMIN ROUTE
router.post("/",createUser)
router.get("/:id", specificUserDetails)
router.put("/:id",updateUserDetails)
router.delete("/:id",deleteSpecificUser)
// USER SEARCH
router.get("/:name",getSpecificUserCard)



export default router

