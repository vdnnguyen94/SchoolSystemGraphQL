const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "Comp229_Survey",
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://vdnnguyen94:SurveyApp@surveyapp.1fgijrv.mongodb.net/SchoolSystem?retryWrites=true&w=majority"
};

export default config;
