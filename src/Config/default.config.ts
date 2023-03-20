import dotenv from 'dotenv';

dotenv.config();


    const databse_uri={

       
        MONGODB_URI:process.env.MONGODB_URI,
        JWT_SECRET : process.env.JWT_SECRET,
        EMAIL : process.env.EMAIL,
        EMAIL_PASSWORD : process.env.EMAIL_PASSWORD,
        PASSWORD_REGEX : process.env.PASSWORD_REGEX,
        LOCAL_HOST : process.env.LOCAL_HOST,

        
    }


export default databse_uri
