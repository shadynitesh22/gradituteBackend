
import { Document, model, Schema } from 'mongoose';
import user_types_config from '../../Config/user_types.config';

// #Create UserType Schema

export interface IUserType extends Document {

    accessLevel: string;

}

// Will nested in user response as a nested dict like this:
const UserTypeSechema: Schema = new Schema({
    accessLevel:
    {
        type: String,
        required: true,
        default: user_types_config.user
    }


});


const UserType = model<IUserType>('UserType', UserTypeSechema);


export default UserType;