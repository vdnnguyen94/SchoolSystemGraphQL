const isEmailExists = async (email) => {
    try {
        let response = await fetch(`/api/users/email/${email}`, {
        method: 'GET'
        });
        let data = await response.json();
        return data && data.error === 'Email is already taken.';
    } catch (err) {
        console.log(err);
    }
    };

  // Helper function to check if username exists
const isUsernameExists = async (username) => {
    try {
      let response = await fetch(`/api/users/username/${username}`, {
        method: 'GET'
      });
  
      let data = await response.json();
  
      return data && data.error === 'Username is already taken.';
    } catch (err) {
      console.log(err);
    }
};
const create = async (user) => { 
    try {
        // Add email and username verification before making the API call
        const emailExists = await isEmailExists(user.email);
        const usernameExists = await isUsernameExists(user.username);
 
        if (emailExists) {
            return { error: 'Email is already taken.' };}
 
        if (usernameExists) {
            return { error: 'Username is already taken.' };}
        let response = await fetch('/api/users/', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)});
        
        return await response.json();
        } catch (err) {
            console.log(err);
        }
};
const resetPassword = async (user) => {
    try {
        console.log(user);
      // Validate username and email
      if (!user.username || !user.email) {
        return { error: 'Username and email are required.' };
      }
  
      // Validate password and confirm password
      if (user.newPassword !== user.newPasswordConfirm) {
        return { error: 'Password and confirmation must match' };
      }
      if (user.newPassword.length < 6) {
        return { error: 'Password Length Minimum is 6' };
      }
      // Fetch data to reset password
      let response = await fetch('/api/users/resetpassword', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user.username,
            email: user.email,
            newPassword: user.newPassword,  // Updated parameter name
            newPasswordConfirm: user.newPasswordConfirm  // Updated parameter name
          })
        });
  
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
const list = async (signal) => { 
  try {
  let response = await fetch('/api/users/', { 
  method: 'GET',

  signal: signal, 
  })
  return await response.json() 
  } catch(err) {
  console.log(err) 
  }
}
const read = async (params, credentials, signal) => { 
try {
let response = await fetch('/api/users/' + params.userId, { 
method: 'GET',
signal: signal, 
headers: {
'Accept': 'application/json',
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + credentials.t 
}
})
return await response.json() 
} catch(err) {
console.log(err) 
}
}
const update = async (params, credentials, user) => { 
try {
let response = await fetch('/api/users/' + params.userId, { 
method: 'PUT',
headers: {
'Accept': 'application/json',
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + credentials.t 
},
body: JSON.stringify(user) 
})
return await response.json() 
} catch(err) {
console.log(err) 
}
}
const remove = async (params, credentials) => { 
try {
let response = await fetch('/api/users/' + params.userId, { 
method: 'DELETE',
headers: {
'Accept': 'application/json',
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + credentials.t 
}
})
return await response.json() 
} catch(err) {
console.log(err) 
}
}
const updatePassword = async (params, credentials, user) => {
  try {
    let response = await fetch(`/api/users/${params.userId}/updatepassword`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({
        oldPassword: user.oldPassword,
        newPassword: user.newPassword,
        newPasswordConfirm: user.newPasswordConfirm
      })
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export { create, resetPassword, list, read, update, remove,isEmailExists,isUsernameExists,updatePassword}