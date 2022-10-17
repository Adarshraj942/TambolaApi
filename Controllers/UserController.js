import UserModel from "../Model/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userWalletModel from "../Model/userWalletModel.js";
export const updateUser=async(req,res)=>{
    console.log("haiii");
    const id=req.params.id;
    const {_id,password}=req.body;
    
   


    if(id===_id ){
        try {

            if(password)
            {
              const salt =await bcrypt.genSalt(10)
              req.body.password= await bcrypt.hash(password,salt) 
            }
           const user =await UserModel.findByIdAndUpdate(id,req.body,{new:true})

          const token=jwt.sign({
            username:user.username,
            id:user._id
          },process.env.JWT_KEY,{expiresIn:"1h"})
           res.status(200).json({user,token})


        } catch (error) {
            res.status(500).json(error) 
        }
    }else{
        res.status(403).json("Access denied ! you can update only ypur own profile")
    }
}


export const getUserWallet=async(req,res)=>{

const {userId}=req.body
    try {
        const wallet=await userWalletModel.findOne({ownerId:userId})
        let totalUSable=wallet.winningAmount+wallet.userAddedAmount
        const data= await userWalletModel.findOneAndUpdate ({ownerId:userId},{$set:{totalUsableAmount:totalUSable}},{new:true})
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}