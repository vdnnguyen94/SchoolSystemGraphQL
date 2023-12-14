// api-submit.js

const checkCompletedSurvey = async (params, credentials) => {
    try {
        let response = await fetch(`/api/surveys/${params.surveyId}/check`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
          }
        });
    
        return await response.json();
      } catch (err) {
        console.log(err);
      }
    };
const updateSurveyResult = async (params, credentials, answeredQuestions) => {
try {
  if(!credentials.t){
    return { error: "Missing credentials.t"};
  }
  let response = await fetch(`/api/surveys/${params.surveyId}/submit`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + credentials.t
  },
  
  body: JSON.stringify(answeredQuestions)
  });
    
   return await response.json();
  } catch (err) {
    console.log(err);
    }
};   
export { checkCompletedSurvey, updateSurveyResult };