
import { updateData as updateDepartment, updateStatus as updateDepartmentStatus } from "../redux/departmentSlice"
import { fetchDepartments } from '@/services/departmentService';

const initiateData = (storeRef) => {
    updateDepartmentStatus("loading")
    fetchDepartments().then((response) => {
        updateDepartment(response.data);
    }).finally(() => {
        updateDepartmentStatus("succeed")
    })
}

export default initiateData;