import api from "@/lib/axios"

export const createDepartmentApi = async (department) => {
    const response = await api.post("/department/create", department);

    return response.data;
}

export const fetchDepartmentsApi = async () => {
    const response = await api.get("/department");
    return response.data;
}