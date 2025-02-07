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
const listStudents = async () => {
    try {
        let response = await fetch('/api/students', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        return await response.json();
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

export { listStudents };

export { create };
