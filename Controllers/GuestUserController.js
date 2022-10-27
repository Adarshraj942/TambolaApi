import GuestUserModel from "../Model/guestUserModel.js";


export const createGuestUser=async(req,res)=>{
  // const { username } = req.body;
   
   const newUser = GuestUserModel(req.body);
 
   try {
    const {username}=req.body
    const oldUser = await GuestUserModel.findOne({ username });
    if(!oldUser){
        const user = await newUser.save();
        if(user){
            res.status(200).json({user})
        }else{
            res.status(400).json({errMessage:"Cant save guestUser information"})
        }
    }else{
        res.status(401).json({errMessage:" username already used"})
    }
   } catch (error) {
      res.status(500).json({error})
   }

}
                                      

