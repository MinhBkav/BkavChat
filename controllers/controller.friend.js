const path = require('path');
const { getListFriend } = require( '../services/service.friend');
exports.getListFriend  = async (req,res) =>{
 try{
    const UserID = req.UserID;
    const ListFriendGet = await getListFriend({UserID});
    return res.status(200).json({
      status: 1,
      data: ListFriendGet,
      message: "success"
    });

 } catch(err){
                          return res.status(err.status|| 400).json({status: 0,message:err.message,code:"h111"});
 }
}