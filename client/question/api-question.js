// api-question.js

const createQuestion = async (params, credentials, question) => {
  try {
    let response = await fetch(`/api/surveys/questions/${params.surveyId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
      body: JSON.stringify(question),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: 'Internal Server Error' };
  }
};

const listSurveyQuestions = async (params, signal) => {
  try {
    let response = await fetch(`/api/surveys/questions/${params.surveyId}`, {
      method: 'GET',
      signal: signal
    });

    const questions = await response.json();
    
    if (response.ok) {
      return questions;
    } else {
      return { error: questions.error };
    }
  } catch (err) {
    console.log(err);
    return { error: 'Internal Server Error' };
  }
};
const questionByID = async (params, signal) => {
  try {
    if(!params.questionId){
      return { error: Missing};
    }
    let response = await fetch(`/api/question/${params.questionId}/get` , {
      method: 'GET',
      signal: signal
    })
    return response.json()
  }catch(err) {
    console.log(err)
  }
};
const updateQuestion = async (params, credentials, question) => {
  try {
    let response = await fetch(`/api/question/${params.surveyId}/${params.questionId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
      body: JSON.stringify(question),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: 'Internal Server Error' };
  }
};

const updateMCQuestion = async (params, credentials, newPossibleAnswers) => {
  try {
    let response = await fetch(`/api/question/${params.questionId}/MC`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
      body: JSON.stringify({ newPossibleAnswers }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: 'Internal Server Error' };
  }
};

const removeQuestion = async (params, credentials) => {
  try {
    let response = await fetch(`/api/question/${params.surveyId}/${params.questionId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: 'Internal Server Error' };
  }
};
const updateQuestionName = async (params, credentials, name) => {
  try {
    let response = await fetch(`/api/question/${params.surveyId}/${params.questionId}/updateName`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: 'Internal Server Error' };
  }
};
export {
  createQuestion,
  listSurveyQuestions,
  questionByID,
  updateQuestion,
  updateMCQuestion,
  removeQuestion,
  updateQuestionName,
};
