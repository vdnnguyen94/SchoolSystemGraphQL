//Van Nguyen implement resetPassword
//Van Nguyen implement validation for sign in
const signin = async (user) => { 
try {
//validation username
if (!user.username) {
    return { error: 'Username required' };}   
if (user.password.length < 6) {
        return { error: 'Password has to contain 6 letters or numbers;' };}
let response = await fetch('/auth/signin/', { 
method: 'POST',
headers: {
'Accept': 'application/json',
'Content-Type': 'application/json' 
},

body: JSON.stringify(user)
})
return await response.json() 
} catch(err) {
console.log(err) 
}
}
const signout = async () => { 
try {
let response = await fetch('/auth/signout/', { method: 'GET' }) 
return await response.json()
} catch(err) { 
console.log(err)
} 
}



  export { signin, signout};