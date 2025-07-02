import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../redux/Apis/Exams";
import Loading from "../../Components/Loading/Loading";
import { MdDeleteOutline } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
function Exams() {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const { exams, loading, error } = useSelector((state) => state.exams);
  const handleConfirmDelete = async () => {
    setOpenDialog(false);
    const toastId = toast.loading("جاري الإرسال...");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/exams/${selectedExamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(getAllExams());
      }
      toast.success("تم الحذف بنجاح", { id: toastId });
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
    }
  };
  useEffect(() => {
    dispatch(getAllExams());
  }, [dispatch]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center my-4">
          <h2 className="text-xl font-bold mb-4">الاختبارات</h2>
          <Link
            to={"/addexam"}
            className="bg-main flex justify-center items-center rounded p-2 text-white"
          >
            أضافة اختبار
          </Link>
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <ul className="space-y-2">
            {exams.length === 0 ? (
              <li>لا توجد اختبارات متاحة.</li>
            ) : (
              exams.map((exam) => (
                <li
                  key={exam.id}
                  className="flex justify-between items-center border p-2 rounded shadow-sm"
                >
                  <div className="flex flex-col">
                    <h3 className="font-semibold">{exam.name}</h3>
                    <p>{exam.description}</p>
                    <p className="text-sm text-gray-600">
                      موعد الاختبار: {new Date(exam.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex lg:flex-row flex-col gap-1">
                    <Link
                      to={`/exam/${exam.id}`}
                      className="flex justify-center items-center rounded gap-1 bg-main p-2 text-white"
                    >
                      عرض الاختبار <GoEye />
                    </Link>
                    <Link className="flex justify-center items-center rounded gap-1 bg-gray-400 p-2 text-black">
                      تعديل الاختبار <CiEdit />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedExamId(exam.id);
                        setOpenDialog(true);
                      }}
                      className="flex justify-center items-center rounded gap-1 bg-red-500 p-2 text-white cursor-pointer"
                    >
                      حذف الاختبار <MdDeleteOutline />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <p>
            هل أنت متأكد أنك تريد حذف هذا الاختبار؟ لا يمكن التراجع عن هذا
            الإجراء.
          </p>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenDialog(false)}
              className="bg-gray-200 text-black p-2 rounded cursor-pointer"
            >
              إلغاء
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded cursor-pointer"
              onClick={handleConfirmDelete}
            >
              حذف
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Exams;
