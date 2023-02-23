import { Schema, Model, Document} from 'mongoose';
import  { IUserType } from './userType.model';
import { IUser } from "../interface/user.interface";
import { Password } from '../../Common/services/authentication/password';
import mongooseService from '../../Common/services/database/mongoose.service'


export interface UserDocument extends Document {
    UserType: IUserType["_id"];
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
const User = mongooseService.getInstance().model<UserDocument, UserModel>(
    "User",
    UserSchema
  );
  

  
export default User

