/*const config = {
env: process.env.NODE_ENV || 'development', 
port: process.env.PORT || 3000,
jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", 
mongoUri: process.env.MONGODB_URI ||
process.env.MONGO_HOST ||
'mongodb://' + (process.env.IP || 'localhost') + ':' + 
(process.env.MONGO_PORT || '27017') +
'/mernproject' 
}
export default config*/

const config = {
  env: process.env.NODE_ENV || 'development', 
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "Comp229_Survey", 
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://VanNguyen:123@toonie.uefooxv.mongodb.net/?retryWrites=true&w=majority"||
  process.env.MONGO_HOST ||
  'mongodb://' + (process.env.IP || 'localhost') + ':' + 
  (process.env.MONGO_PORT || '27017') +
  '/SurveyApp'
  }
export default config