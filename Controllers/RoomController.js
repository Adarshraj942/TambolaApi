import RoomModel from "../Model/roomMatchModel.js";
import Tambola from "tambola-generator";
const tambola =Tambola.default
import roomWalletModel from "../Model/roomWalletModel.js";
import userWalletModel from "../Model/userWalletModel.js";

//create practice match
export const creatematch=async(req,res)=>{
try {
    const {createrId,type,fee}=req.body
    let newMatch=RoomModel({createrId:createrId})
          newMatch.members.push(createrId)
           newMatch.type=type
           newMatch.fee=fee
    // const user= await PractiseModel.find({createrId:createrId})
       
        const match=await newMatch.save()
        const wallet=roomWalletModel({
          roomId:match._id
          
        })
        await wallet.save()
        console.log("wallet created");
        res.status(200).json({match}) 
} catch (error) {
    res.status(500).json(error)
    
}
    

}

//join match

export const joinmatch=async(req,res)=>{
   try {
    const {userId ,matchId}=req.body
    const match =await RoomModel.findById(matchId)
    if(match.members.length>=match.type){
      res.status(400).json("Room is full")
    }else{
      const match =await RoomModel.findByIdAndUpdate(matchId,{ $addToSet:{members:userId}},{new:true})
      res.status(200).json({match})
    }

 
    
   } catch (error) {
      res.status(200).json(error)
   }
}


//start a match
export const startmatch=async(req,res)=>{
  console.log("haiiii") 
try {
    const {matchId}=req.body
    const match =await RoomModel.findById(matchId)
    

      if(match.members.length == match.type){
        if(match.draw.length>0){
          res.status(400).json("Game already started")
        }else{
          const draw=tambola.getDrawSequence() //Returns numbers 1-90 scrambled
          const data = await RoomModel.findByIdAndUpdate(matchId,{$set:{draw:draw}},{new:true})
          console.log(data)
             res.status(200).json({data})
        }
       
       }else{
           res.status(401).json("wait for users")
       }
    
} catch (error) {
    res.status(500).json(error)
}
}
// get tickets
export const getTickets=async(req,res)=>{
 
try {
    const {ticketCount ,matchId ,userId}=req.body
    const matchData=await RoomModel.findById(matchId)
    if(matchData){
      if(matchData.members.indexOf(userId) !== -1){
        console.log("haiiii")
        if(ticketCount<=3){

          
      
          const userWallet=await userWalletModel.findOne({ownerId:userId})
          console.log("hello",userWallet);
          if(userWallet.defaultAmount>=matchData.fee){
            const x  = tambola.generateTickets(ticketCount) //This generates 100 tambola tickets
            await userWalletModel.findByIdAndUpdate(userWallet._id,{$inc:{defaultAmount:-matchData.fee}},{new:true})
            const matchWallet=await roomWalletModel.findOne({roomId:matchId})
            await roomWalletModel.findByIdAndUpdate(matchWallet._id,{$inc:{walletAmount:matchData.fee}},{new:true})
            res.status(200).json({x})
          }else{
            res.status(400).json("Insufficent Wallet amount")
          }
        }else{
            res.status(400).json("ticket limit exceeds")
        }
    }else{
        res.status(400).json("User not found")
    }
    }else{
       res.status(400).json("Match not found")
    }
 
} catch (error) {
    
}
}
//claim winner spots
export const claim=async(req,res)=>{
   try {
    const {claimType,userId,matchId}=req.body
    const matchData=await RoomModel.findById(matchId)
    const matchWallet =await roomWalletModel.findOne({roomId:matchId})
    let total =matchData.type*matchData.fee
    let TambolaWin=total*(60/100)
    let cornerWin=total*(10/100)
    let firstRowWin=total*(10/100)
    let secondRowWin=total*(10/100)
    let thirdRowWin=total*(10/100)
    if(matchData.members.indexOf(userId)!==-1  ){
       if(claimType==="firstRow" && !matchData.firstRow){
           const data=await RoomModel.findByIdAndUpdate(matchId,{firstRow:userId},{new:true})
               
     await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:firstRowWin}},{new:true})
     await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-firstRowWin}},{new:true})
        
         return   res.status(200).json("First row claimed")
       }
      else if(claimType==="secondRow" && !matchData.secondRow){
           const data=await RoomModel.findByIdAndUpdate(matchId,{secondRow:userId},{new:true})
           await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:secondRowWin}},{new:true})
           await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-secondRowWin}},{new:true})
        
           return     res.status(200).json("Second row claimed")
       }
       else if(claimType==="thirdRow" && !matchData.thirdRow){
           const data=await RoomModel.findByIdAndUpdate(matchId,{thirdRow:userId},{new:true})
              
     await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:thirdRowWin}},{new:true})
     await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-thirdRowWin}},{new:true})
        
           return  res.status(200).json("Third row claimed")
       }
       else if(claimType==="corner" && !matchData.corner){
           const data=await RoomModel.findByIdAndUpdate(matchId,{corner:userId},{new:true})
           console.log(data);


           await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-cornerWin}},{new:true})
     
           await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:cornerWin}},{new:true})
         return  res.status(200).json("Corner claimed")

       }
       else if(claimType==="tambola" && !matchData.tambola){
           const data=await RoomModel.findByIdAndUpdate(matchId,{tambola:userId},{new:true})
           await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-TambolaWin}},{new:true})
     
           await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:TambolaWin}},{new:true})
         
           return  res.status(200).json("Tambola claimed")
       }else{
         return  res.status(400).json("already claimed ") 
       }

       
    }else{
       res.status(400).json("Cant find user")
    }
   } catch (error) {
      res.status(500).json(error)
   }
}

//remove match

export const removeMatch=async(req,res)=>{
  try {
    const {matchId}=req.body
    const match =await RoomModel.findById(matchId)
    if(match){
      
   await RoomModel.findByIdAndRemove(matchId)
   res.status(200).json("Match data deleted successfully")

    }    else{
      res.status(400).json("Match data not found")
    }  

  
  } catch (error) {
    res.status(500).json(error)
  }
}

//get all match

export const allMatch = async(req,res)=>{
  try {
     const data =await RoomModel.find()
        const beta=data.reverse()
     
     res.status(200).json({beta})
  } catch (error) {
    res.status(500).json(error)
  }
}


export const winners = async(req,res)=>{
  try {

    const {matchId}=req.body
    const match =await RoomModel.findById(matchId) 
  
    let winners={}
    winners.Tambola=match.tambola
    winners.Corner=match.corner
    winners.ThirdRow=match.thirdRow
    winners.FirstRow=match.firstRow
    winners.SecondRow=match.secondRow
   
     res.status(200).json(winners)
  } catch (error) {
    res.status(500).json(error)
  }
} 