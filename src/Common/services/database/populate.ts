import UserType from "../../../User/userType.model";
import user_types_config from "../../../Config/user_types.config";

// #Create UserType Schema

async function isPopulated():Promise<boolean> {
    const user_types = await UserType.find();
    if(user_types.length === 0){return false}

    return true;
}

export async function DbPopulate ():Promise<void>{
    const populated = await isPopulated();
    if(!populated){
        for(let type in user_types_config){
            const newType = new UserType({
                  accessRights: type
            });
            await newType.save();
      }
    }else{
        console.log("Database is already populated");

    }
}