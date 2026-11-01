import api from "@/lib/axios"

export const createBatchApi = async (batch) => {
    const response = await api.post("/batch/create", batch);

    return response.data;
}

export const fetchBatchesApi = async () => {
    const response = await api.get('/batch');

    return response.data;
}

export const assignStudentApi = (batchId, studentId) => {
    const response = api.patch("batch/student/assign", {
        batchId, studentId
    });

    return response.data;
}

export const deleteBatchApi = async (id) => {
    const response = await api.delete(`/batch/${id}`)

    return response.data;
}
