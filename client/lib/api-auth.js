const signin = async (student) => { 
  try {
      // Validate studentNumber and password before sending request
      if (!student.studentNumber) {
          return { error: 'Student Number is required' };
      }
      if (!student.password) {
          return { error: 'Password is required' };
      }
      if (student.password.length < 6) {
          return { error: 'Password must be at least 6 characters long' };
      }

      let response = await fetch('/auth/signin', {  // Fixed extra slash
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
          },
          body: JSON.stringify(student)
      });

      return await response.json();
  } catch (err) {
      console.log('Sign-in error:', err);
      return { error: 'Server error. Please try again later.' };
  }
};

const signout = async () => { 
  try {
      let response = await fetch('/auth/signout', { method: 'GET' }); // Fixed extra slash
      return await response.json();
  } catch (err) { 
      console.log('Sign-out error:', err);
      return { error: 'Could not sign out. Please try again.' };
  }
};

export { signin, signout };
