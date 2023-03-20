import { Schema, Model, Document} from 'mongoose';
import  { IUserType } from './userType.model';
import { IUser } from "../interface/user.interface";
import { Password } from '../../Common/services/authentication/password';
import mongooseService from '../../Common/services/database/mongoose.service'


export interface UserDocument extends Document {
    UserType: IUserType["_id"];
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
}


interface UserModel extends Model<UserDocument>{
    build(attrs:IUser):UserDocument;
}

const UserSchema :Schema = new Schema({
    email :{type:String,required:true},
    password : {type:String,required:true},
    firstName:{type:String,requried:true},
    lastName:{type:String,required:true},
    userType : {type:Schema.Types.ObjectId,ref:"UserType"},
    isActive:{type:Boolean,required:false,default:false},

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

