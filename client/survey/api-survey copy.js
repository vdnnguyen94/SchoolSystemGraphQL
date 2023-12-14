const create = async (params, credentials, survey) => {
    try {
      if (!params.userId) {
        return { error: "Missing userID"};
      }
      // Survey Name exist or not
      if (survey.name.length < 4) {
        return { error: 'Survey name must be at least 4 characters long.' };
      }
      // validate date, cannot create a survey expire within 3 days
      if(survey.dateExpire)
      {
        if (new Date(survey.dateExpire) - new Date() < 3 * 24 * 60 * 60 * 1000) {
            return { error: 'Survey expiration date must be at least 3 days from now.' };}
        }

      // create survey copy from prof shop
      let response = await fetch('/api/surveys/by/' + params.userId, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t 
        },
        body: JSON.stringify(survey),
      });
      const data = await response.json();
      if (response.ok) {
        return { message: data.message };
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  };
  
  const list = async (signal) => {
    try {
      let response = await fetch('/api/surveys', {
        method: 'GET',
        signal: signal
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const listByOwner = async (params, credentials, signal) => {
    try {
      let response = await fetch('/api/surveys/by/'+params.userId, {
        method: 'GET',
        signal: signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    }catch(err){
      console.log(err)
    }
  }
  
  const read = async (params, signal) => {
    try {
      let response = await fetch('/api/survey/' + params.surveyId, {
        method: 'GET',
        signal: signal,
      })
      return response.json()
    }catch(err) {
      console.log(err)
    }
  }
  
  const update = async (params, credentials, survey) => {
    try {
      let response = await fetch('/api/surveys/' + params.surveyId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        },
        body: survey
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  const remove = async (params, credentials) => {
    try {
      let response = await fetch('/api/surveys/' + params.surveyId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }
  
  export {
    create,
    list,
    listByOwner,
    read,
    update,
    remove
  }
  