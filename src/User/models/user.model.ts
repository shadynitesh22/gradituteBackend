import { Schema, Model, Document, PassportLocalDocument} from 'mongoose';
import  { IuserType } from './userType.model';
import { IUser } from "../interface/user.interface";
import { Password } from '../../Common/services/authentication/password';
import mongooseService from '../../Common/services/database/mongoose.service'

import passportLocalMongoose from 'passport-local-mongoose';


export interface UserDocument extends PassportLocalDocument {
    UserType: IuserType["_id"];
    email: string;
    password: string;
    username: string;

}


interface UserModel extends Model<UserDocument>{
    build(attrs:IUser):UserDocument;
}

const UserSchema :Schema = new Schema({
    email :{type:String,required:true},
    password : {type:String,required:true},
    username:{type:String,requried:true},
    userType : {type:Schema.Types.ObjectId,ref:"UserType"}

},
{
    toObject:{
        transform:function(doc,ret){},
    },
    toJSON:{
        transform:function(doc,ret){
            delete ret.password
        },
    },

}


);

// This step is optional as we will use passport for authentication and passport will take care of this!!
UserSchema.pre("save",async function (done) {
    if (this.isModified("password")){

        const hashed = await Password.toHash(this.get("password"));
        this.set("password",hashed)
    }
    done();
});

UserSchema.statics.build = (attrs:IUser) =>{
return new User(attrs);
}

UserSchema.plugin(passportLocalMongoose);
const User = mongooseService.getInstance().model<UserDocument, UserModel>(
    "User",
    UserSchema
  );
  



  
export default User