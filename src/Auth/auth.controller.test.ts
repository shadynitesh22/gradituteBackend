// import request from 'supertest';
// import { createConnection, Connection } from 'typeorm';
// import { AuthController } from './auth.controller';
// import  User  from '../User/user.model';

// const jwtSecret: string = process.env.JWT_SECRET || "12321321";
// const authController = new AuthController();
// let connection: Connection;

// describe('AuthController', () => {
//   beforeAll(async () => {
//    const  connection = await createConnection();
//     await connection.runMigrations();
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   describe('login', () => {
//     test('should return 200 and user data with a valid email and password', async () => {
//       const user = new User();
//       user.username = 'testuser';
//       user.email = 'testuser@email.com';
//       user.password = 'Testuser1234';
//       await connection.manager.save(user);

//       const res = await request(authController.login)
//         .post('/login')
//         .send({ email: 'testuser@email.com', password: 'Testuser1234' });

//       expect(res.status).toBe(200);
//       expect(res.body.data.username).toBe(user.username);
//       expect(res.body.data.email).toBe(user.email);
//       expect(res.body.token).toBeDefined();
//     });

//     test('should return 400 if password is incorrect', async () => {
//       const user = new User();
//       user.username = 'testuser';
//       user.email = 'testuser@email.com';
//       user.password = 'Testuser1234';
//       await connection.manager.save(user);

//       const res = await request(authController.login)
//         .post('/login')
//         .send({ email: 'testuser@email.com', password: 'WrongPassword' });

//       expect(res.status).toBe(400);
//       expect(res.body.message).toBe('Invalid Password');
//     });

//     test('should return 400 if password does not meet requirements', async () => {
//       const res = await request(authController.login)
//         .post('/login')
//         .send({ email: 'testuser@email.com', password: 'password' });

//       expect(res.status).toBe(400);
//       expect(res.body.message).toBe('Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters.');
//     });

//     test('should return 404 if email is not found', async () => {
//       const res = await request(authController.login)
//         .post('/login')
//         .send({ email: 'nonexistentuser@email.com', password: 'Testuser1234' });

//       expect(res.status).toBe(404);
//       expect(res.body.message).toBe('User not Found');
//     });
//   })
// })



// Signup function using passport for authentication and sessions
// async signup(req: Request, res: Response, next: NextFunction) {
//   try {
//       const username = req.body.username;
//       const email = req.body.email;
//       const password = req.body.password;
//       const UserType = req.body.UserType;
  
//       const user = await authService.findUserByEmail(email);
//       log("user", user);
  
//       if (user) {
//           throw new Error("User already exists");
//       } else {
//           const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
//           if (!passwordRegex.test(password)) {
//               return res.status(400).json({
//                   success: false,
//                   message: "Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters."
//               });
//           }
//           try {
//               const newUser = await authService.createUser({
//                   username,
//                   UserType,
//                   email,
//                   password
//               });
//               log(newUser, "Comes undefined i");
//               passport.authenticate('local', (err, user, info) => {
//                   if (err) {
//                       return next(err);
//                   }
//                   if (!user) {
//                       return res.status(400).json({
//                           success: false,
//                           message: info
//                       });
//                   }
//                   req.logIn(user, function (err) {
//                       if (err) {
//                           return next(err);
//                       }
//                       return res.status(200).json({
//                           success: true,
//                           data: user,
//                           message: "Successfully signed up and logged in"
//                       });
//                   });
//               })(req, res, next);
//           } catch (e) {
//               log("Controller capturing error", e);
//               throw new Error("Error while registering");
//           }
//       }
//   } catch (e) {
//       next(e);
//   }
// }
