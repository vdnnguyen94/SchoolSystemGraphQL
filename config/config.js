const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "SchoolSystem",
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://vdnnguyen94:SurveyApp@surveyapp.1fgijrv.mongodb.net/SchoolSystem?retryWrites=true&w=majority"
};

export default config;
