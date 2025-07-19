import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getOneCourse } from "../../redux/Apis/course";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
function OneCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { oneCourse, loading, error } = useSelector((state) => state.course);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: null }); // type: 'part' | 'lesson'
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    dispatch(getOneCourse({ id }));
  }, [dispatch, id]);

  const data = oneCourse?.data;
  const teacher = data?.Teacher;
  const handleDelete = async () => {
    if (!deleteTarget.id || !deleteTarget.type) return;

    setLoadingDelete(true);
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (deleteTarget.type === "part") {
        await axios.delete(
          `${import.meta.env.VITE_BASEURL}/api/parts/${deleteTarget.id}`,
          config
        );
        toast.success("تم حذف الجزء بنجاح");
      } else if (deleteTarget.type === "lesson") {
        await axios.delete(
          `${import.meta.env.VITE_BASEURL}/api/lessons/${deleteTarget.id}`,
          config
        );
        toast.success("تم حذف الدرس بنجاح");
      }

      dispatch(getOneCourse({ id })); // Refresh the course
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setLoadingDelete(false);
      setConfirmOpen(false);
      setDeleteTarget({ id: null, type: null });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="  mt-10 p-6 bg-white rounded-xl shadow-md text-right space-y-6">
      {/* Course Info */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
        <p className="text-gray-600">{data.description}</p>
        <p className="text-sm text-gray-400 mt-1">
          السنة الدراسية: {data.year} | الفصل الدراسي :{" "}
          {data.term == "FIRST" ? "الأول" : "الثاني"}
        </p>
      </div>

      {/* Teacher Info */}
      <div className="text-sm space-y-1">
        <h2 className="text-lg font-semibold">معلومات المعلم:</h2>
        <p>
          الاسم: {teacher?.firstName} {teacher?.lastName}
        </p>
        <p>البريد الإلكتروني: {teacher?.email}</p>
      </div>

      {/* Parts Accordion */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">
            الوحدات التعليمية ({data._count?.Part})
          </h2>
          <Link
            to={`/addpart/${id}`}
            className="flex justify-center items-center bg-main text-white p-2 rounded-lg"
          >
            <IoMdAdd /> اضف وحدة
          </Link>
        </div>

        {data.Part.length === 0 ? (
          <p className="text-gray-500">لا توجد وحدات حالياً.</p>
        ) : (
          data.Part.map((part) => (
            <Accordion key={part.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="font-semibold"
              >
                <div className="flex justify-between items-center w-full px-4">
                  <Typography className="text-lg">{part.name}</Typography>
                  <div className="flex items-center justify-between gap-1">
                    <Link
                      to={`/addlesson/${part.id}`}
                      className="flex gap-1 items-center justify-center bg-main text-white p-2 my-2 rounded-lg"
                    >
                      <IoMdAdd /> اضف درس
                    </Link>
                    <button
                      className="bg-red-600 p-2 rounded cursor-pointer text-white flex items-center"
                      onClick={() => {
                        setDeleteTarget({ id: part.id, type: "part" });
                        setConfirmOpen(true);
                      }}
                    >
                      <MdDelete /> حذف الجزء
                    </button>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className="mb-2 text-sm text-gray-600">
                  {part.description}
                </Typography>
                <Divider className="my-2" />

                {/* Lessons */}
                {part.Lesson && part.Lesson.length > 0 ? (
                  <ul className="list-disc pr-5 space-y-2 text-sm text-gray-700">
                    {part.Lesson.map((lesson) => (
                      <li key={lesson.id || lesson.uuid}>
                        <div className="flex justify-between my-2 items-center">
                          <p>{lesson.name}</p>
                          <button
                            className="flex items-center p-2 bg-red-600 text-white cursor-pointer rounded"
                            onClick={() => {
                              setDeleteTarget({
                                id: lesson.id,
                                type: "lesson",
                              });
                              setConfirmOpen(true);
                            }}
                          >
                            <MdDelete /> حذف الدرس
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">لا توجد دروس بعد.</p>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </div>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <p>
            هل أنت متأكد أنك تريد حذف{" "}
            {deleteTarget.type === "part" ? "هذا الجزء" : "هذا الدرس"}؟
          </p>
        </DialogContent>
        <DialogActions>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setConfirmOpen(false)}
              disabled={loadingDelete}
              className="bg-gray-400 text-black rounded cursor-pointer p-2"
            >
              إلغاء
            </button>
            <button
              className="bg-red-600 text-white rounded cursor-pointer p-2"
              onClick={handleDelete}
              disabled={loadingDelete}
              color="error"
            >
              {loadingDelete ? "جاري الحذف..." : "حذف"}
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OneCourse;
