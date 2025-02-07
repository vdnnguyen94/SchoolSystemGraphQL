const create = async (student) => { 
    try {
        // Check if passwords match
        if (student.password !== student.passwordConfirm) {
            return { error: 'Passwords do not match' };
        }

        let response = await fetch('/api/students/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        return await response.json();
    } catch (err) {
        console.log(err);
        return { error: 'Something went wrong. Please try again.' };
    }
};

export { create };
