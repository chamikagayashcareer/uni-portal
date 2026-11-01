'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore, perms } from '@/lib/storeProvider';
import { PageHeader, Modal, Field, Select, Empty } from '@/components/ui';
import { createCourseApi, fetchCoursesApi } from '@/services/courseService';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourses } from '@/lib/redux/courseSlice';
import { fetchDepartmentsApi } from '@/services/departmentService';
import { updateDepartments } from '@/lib/redux/departmentSlice';

export default function Courses() {
  const { db, me } = useStore();
  const p = perms(me);
  const [dept, setDept] = useState('');
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState({
    addCourse: false,
    getCourses: false,
    getDepartments: false
  });
  const rows = db.courses.filter((c) => !dept || c.deptId === dept);
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.value);
  const departments = useSelector((state) => state.departments.value);

  useEffect(() => {
    if (courses.length == 0) {
      getCourses();
    }

    if (departments.length == 0) {
      getDepartments()
    }
  }, [])

  const getDepartments = () => {
    if (loading.getDepartments) return;
    setLoading({ ...loading, getDepartments: true })
    fetchDepartmentsApi().then((response) => {
      dispatch(updateDepartments(response.data))
    }).finally(() => {
      setLoading({ ...loading, getDepartments: false })
    })
  }

  const getCourses = () => {
    setLoading({ ...loading, getCourses: true })
    fetchCoursesApi().then((response) => dispatch(updateCourses(response.data))).finally(() => { setLoading({ ...loading, getCourses: false }) });
  }

  const addCourse = (e) => {
    e.preventDefault();
    if (loading.addCourse) return;
    setLoading({ ...loading, addCourse: true })
    createCourseApi(edit).finally(() => {
      setLoading({ ...loading, addCourse: false })
      setEdit(null);
      getCourses();
    })
  }

  return (
    <>
      <PageHeader title="Courses" sub="Programmes and the modules they are made of."
        action={p.manageCourses && <button className="btn"
          onClick={() => setEdit({ name: '', code: '', departmentId: departments[0].id || db.departments[0]?.id || '', duration: 4, description: '' })}>Add course</button>} />

      <div className="mb-4 w-56"><Select value={dept} onChange={setDept} placeholder="All departments"
        options={departments.map((d) => ({ value: d.id, label: d.name }))} /></div>

      {courses.length === 0 ? <Empty>No courses found.</Empty> : (
        <div className="card divide-y">
          {courses.map((c) => (
            <Link key={c.id} href={`/courses/${c.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-slate-50">
              <div><div className="font-display text-lg text-forest">{c.name}</div><div className="text-sm text-slate-500">{c.code} · {departments.find((d) => d.id === c.departmentId)?.name}</div></div>
              <div className="text-sm text-slate-600">{db.modules.filter((m) => m.courseId === c.id).length} modules · {db.batches.filter((b) => b.courseId === c.id).length} batches · {c.duration} years</div>
            </Link>
          ))}
        </div>
      )}

      {edit && (
        <Modal title="Add course" onClose={() => setEdit(null)}>
          <form onSubmit={addCourse}>
            <Field label="Name"><input className="inp" required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Code"><input className="inp" required value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value })} /></Field>
            <Field label="Department"><Select value={edit.departmentId} onChange={(v) => setEdit({ ...edit, departmentId: v })} options={departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
            <Field label="Duration (years)"><input className="inp" type="number" min="1" max="8" value={edit.duration} onChange={(e) => setEdit({ ...edit, duration: e.target.value })} /></Field>
            <Field label="Description"><textarea className="inp" rows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <button className="btn w-full">Save course</button>
          </form>
        </Modal >
      )
      }
    </>
  );
}
