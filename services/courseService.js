import api from "../lib/axios"


export const createCourseApi = async (course) => {
    const response = await api.post("/course/create", course);

    return response.data;
}


export const fetchCoursesApi = async () => {
    const response = await api.get("course");

    return response.data;
}
