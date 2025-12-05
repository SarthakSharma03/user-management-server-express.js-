import { jsonResponse } from "../utility/jsonResponse.js";
import { generateToken } from "../utility/token.js";
import { createUser, getAllUsers, getuserById, updateUser, deleteUser,updatePassword, login } from "./manageUser.js";
import jwt from 'jsonwebtoken'
import {config as envConfig} from 'dotenv'

envConfig()

 const secretKey = process.env.JWT_SECRET



//  LOGIN 
export const adminLogin = async (req, res) => {
  try {
    const dataFromReq = await req.body;
    const { email, password } = dataFromReq;
    
    if (!email || !password ) {
      return jsonResponse(res, { 
        message: "Email and password are required",
        success: false 
      });
    }
    
    const admin = await login(email, password);
    const token = generateToken({ email: admin.email, id: admin.id });
    return jsonResponse(res, {
      message: " login successful",
      data: admin,
      success: true,
      token
    });
  } catch (error) {
    console.error(" login error:", error);
    return jsonResponse(res, { 
      message: error.message || "login failed",
      success: false 
    });
  }
};


//  USERCREATE
export const userCreate = async (req, res) => {
  try {
    const dataFromReq = req.body;
    await createUser(dataFromReq);
    return jsonResponse(res, { 
      message: "User created successfully", 
      data: dataFromReq,
      success: true 
    });
  } catch (error) {
    return jsonResponse(res, { 
      message: error.message||"Error creating user", 
      success: false 
    });
  }
};

// GET ALL USER
export const getAllUser = (req, res) => {
  const reqUrl = req.url;
  const [, queryString = ""] = reqUrl.split("?");
  const queryParams = {};
  if (queryString) { 
    for (const part of queryString.split("&")) {
      const [k, v] = part.split("=");
      if (k) queryParams[k] = v;
    }
  }

  const all = getAllUsers();

  if (!queryString) {
    return jsonResponse(res, { message: "get all users", data: all });
  }

  const page = Math.max(Number.parseInt(queryParams.page || "1", 10) || 1, 1);
  const limit = Math.max(Number.parseInt(queryParams.limit || "3", 10) || 3, 1);
  const total = all.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const data = all.slice(start, end);

  return jsonResponse(res, { message: "get users (paginated)", data, pagination: { total, page: currentPage, limit, totalPages } });
}


// GET SPECIFIC USER DETAILS
export const specificUserDetails = async(req,res)=>{
   try {
    const id = req.params.id;

    if (!/^EMP-\d+-LM$/.test(id)) {
      return jsonResponse(res, { message: "Invalid user ID format" });
    }

    const user = getuserById(id);
    if (!user) {
      return jsonResponse(res, { message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    return jsonResponse(res, {
      message: "User retrieved successfully",
      data: { ...userWithoutPassword, passwordSet: !!password }
    });

  } catch (error) {
    return jsonResponse(res, { message: error.message });
  }
}


// UPDATE USER DETAILS
export const updateUserDetails = (req,res)=>{
    try {
    const id = req.params.id;
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return jsonResponse(res, { message: "No data provided" });
    }

    const updatedUser = updateUser(id, data);

    return jsonResponse(res, {
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    return jsonResponse(res, {
      message: "Failed to update user",
      error: error.message
    });
  }
}

// DELETE SPECIFIC USER
export const deleteSpecificUser =(req,res)=>{
    try {
    const id = req.params.id;
    deleteUser(id);

    return jsonResponse(res, {
      message: "User deleted successfully"
    });

  } catch (error) {
    return jsonResponse(res, { message: error.message }, 500);
  }
}


//  UPDATE USER PASSWORD
export const updateUserPassword =(req,res)=>{
 try {
    const id = req.params.id;
    const { password } = req.body;

    if (!password) {
      return jsonResponse(res, { message: "Password is required" });
    }

    const updated = updatePassword(id, password);

    return jsonResponse(res, {
      message: "Password updated successfully",
      data: updated
    });

  } catch (error) {
    return jsonResponse(res, { message: error.message });
  }
}


// GET SPECIFIC USER CARD
export const getSpecificUserCard =(req,res)=>{
    try {
    const searchName = (req.query.name || "").trim().toLowerCase();
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 3, 1);

    const users = getAllUsers();
    const filtered = searchName
      ? users.filter(u => u.name?.trim().toLowerCase() === searchName)
      : users;

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return jsonResponse(res, {
      message: "Users retrieved successfully",
      data,
      pagination: { total, page, limit, totalPages }
    });

  } catch (error) {
    return jsonResponse(res, { message: "Search failed", error: error.message });
  }
};


// GET SPECIFIC USER DETAILS
 export const getSpecificUserDetails =(req,res)=>{
  try {
     const userToken = req.headers.authorization?.split(' ')[1]
  console.log(userToken,"userToken")
   const decoded = jwt.verify(userToken, secretKey)
      console.log(decoded,'decoded')
  
      const user = getuserById(decoded.id);

      if (!user || user.email !== decoded.email) {
        return jsonResponse(res, { message: "User not found or email mismatch", success: false });
      }

      const { password, ...userWithoutPassword } = user;

      return jsonResponse(res, {
        message: "User details retrieved successfully",
        data: userWithoutPassword,
        success: true
      });
  } catch (error) {
     return jsonResponse(res, { message: "user not found ", error: error.message });
  }
 
 }  