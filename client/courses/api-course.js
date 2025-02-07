const listCourses = async () => {
    try {
        let response = await fetch('/api/courses', {
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

const listUnregisteredCourses = async (params, signal) => {
    try {
        let response = await fetch(`/api/courses/unregistered/${params.studentNumber}`, {
            method: 'GET',
            signal: signal,
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

const registerCourse = async (params, credentials) => {
    try {
        let response = await fetch(`/api/student/${params.studentNumber}/course/${params.courseId}`, {
            method: 'GET',  // Based on course.routes.js, `register` uses GET
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t,
            },
        });
        return await response.json();
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};
const listCoursesByStudent = async (params, signal) => {
    try {
        let response = await fetch(`/api/courses/student/${params.studentNumber}`, {
            method: 'GET',
            signal: signal,
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

const dropCourse = async (params, credentials) => {
    try {
        let response = await fetch(`/api/student/${params.studentNumber}/course/${params.courseId}`, {
            method: 'PUT',  
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t,
            },
        });
        return await response.json();
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

const changeCourseSection = async (params, credentials, newSection) => {
    try {
        let response = await fetch(`/api/student/${params.studentNumber}/course/${params.courseId}`, {
            method: 'POST',  // Based on course.routes.js, changeSection uses POST
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t,
            },
            body: JSON.stringify({ newSection }),
        });
        return await response.json();
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

const createCourse = async (course, credentials) => {
    try {
        let response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t,
            },
            body: JSON.stringify(course),
        });
        return await response.json();
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

const getCourseById = async (courseId) => {
    try {
        let response = await fetch(`/api/courses/${courseId}`, {
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

export {  listCourses, listUnregisteredCourses, listCoursesByStudent, registerCourse, dropCourse, getCourseById, changeCourseSection, createCourse };
