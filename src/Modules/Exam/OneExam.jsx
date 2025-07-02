import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllExams, getExamQuestions } from "../../redux/Apis/Exams";
import Loading from "../../Components/Loading/Loading";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import EditQuestionDialog from "./Exam-Components/EditQuestionDialog";
import axios from "axios";
import toast from "react-hot-toast";

function OneExam() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [editExamDialogOpen, setEditExamDialogOpen] = useState(false);
  const [examFormData, setExamFormData] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
  });
  const { exams, examQuestions, loading, error } = useSelector(
    (state) => state.exams
  );

  const exam = Array.isArray(exams)
    ? exams.find((exam) => exam.id === Number(id))
    : null;

  useEffect(() => {
    dispatch(getAllExams(id));
    dispatch(getExamQuestions(id));
  }, [dispatch, id]);

  const handleDelete = (questionId) => {
    setQuestionToDelete(questionId);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    const toastId = toast.loading("جاري الحذف...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/questions/${questionToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم حذف السؤال بنجاح", { id: toastId });
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      dispatch(getExamQuestions(id)); // refresh questions
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
      console.error(error);
    }
  };
  const handleExamEditSubmit = async () => {
    const toastId = toast.loading("جاري التعديل...");
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: examFormData.name,
        description: examFormData.description,
        date: new Date(examFormData.date).toISOString(),
      };

      await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/exams/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تم التعديل بنجاح", { id: toastId });
      setEditExamDialogOpen(false);
      dispatch(getAllExams()); // Refresh exam data
    } catch (error) {
      console.error(error);
      toast.error("فشل التعديل", { id: toastId });
    }
  };
  const handleEditSave = async (updatedData) => {
    const toastId = toast.loading("جاري التحميل");
    try {
      const token = localStorage.getItem("token");

      // Only send allowed fields
      const {
        question,
        writtenAnswer,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        truOrFalseAnswer,
        score,
        order,
      } = updatedData;

      const payload = {
        question,
        writtenAnswer,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        truOrFalseAnswer,
        score,
        order,
      };

      await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/questions/${updatedData.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تم بنجاح", { id: toastId });
      window.location.reload(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ", { id: toastId });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">معلومات الاختبار</h2>

      {exam ? (
        <div className="border p-4 rounded shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">{exam.name}</h3>
              <p>{exam.description}</p>
              <p className="text-sm text-gray-600">
                التاريخ: {new Date(exam.date).toLocaleDateString()}
              </p>
            </div>
            <Link
              to={`/results/${exam.id}`}
              className="text-white bg-main p-2 rounded-lg"
            >
              عرض نتائج الطلاب
            </Link>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-gray-400 p-2 rounded text-black cursor-pointer flex items-center gap-1"
              onClick={() => {
                setExamFormData({
                  name: exam.name || "",
                  description: exam.description || "",
                  date: new Date(exam.date).toISOString().slice(0, 16),
                });
                setEditExamDialogOpen(true);
              }}
            >
              <MdEdit /> تعديل
            </button>
          </div>
        </div>
      ) : (
        <p>لم يتم العثور على هذا الاختبار.</p>
      )}

      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold mt-6">الأسئلة</h2>
        <Link
          to={`/addquestion/${id}`}
          className="bg-main p-2 text-white rounded-lg "
        >
          اضف سؤالا
        </Link>
      </div>

      <ul className="space-y-4">
        {examQuestions.length === 0 ? (
          <li>لا توجد أسئلة لهذا الاختبار.</li>
        ) : (
          examQuestions.map((q) => (
            <li key={q.id} className="border p-4 rounded shadow-sm relative">
              <p className="font-semibold mb-2">
                ({q.order}) {q.question}
              </p>

              {q.type === "MULTIPLE_CHOICE" && (
                <div className="space-y-1">
                  <p>A: {q.optionA}</p>
                  <p>B: {q.optionB}</p>
                  <p>C: {q.optionC}</p>
                  <p>D: {q.optionD}</p>
                  <p className="text-green-600 font-medium">
                    الإجابة الصحيحة: {["A", "B", "C", "D"][q.correctOption]}
                  </p>
                </div>
              )}

              {q.type === "TRUE_FALSE" && (
                <p className="text-green-600 font-medium">
                  الإجابة: {q.truOrFalseAnswer ? "صحيح" : "خطأ"}
                </p>
              )}

              {q.type === "WRITTEN" && (
                <p className="text-gray-800">
                  الإجابة النموذجية: {q.writtenAnswer}
                </p>
              )}

              <p className="text-sm text-gray-500">الدرجة: {q.score}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditQuestion(q)}
                  className="bg-gray-400 p-2 rounded text-black cursor-pointer flex items-center gap-1"
                >
                  <MdEdit /> تعديل
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="bg-red-500 p-2 rounded text-white cursor-pointer flex items-center gap-1"
                >
                  <MdDeleteOutline /> حذف
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد أنك تريد حذف هذا السؤال؟</Typography>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-gray-600 cursor-pointer text-white p-2 rounded-lg"
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
          >
            إلغاء
          </button>
          <button
            className="bg-red-600 mx-2 cursor-pointer text-white p-2 rounded-lg"
            onClick={confirmDelete}
            color="error"
          >
            حذف
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editExamDialogOpen}
        onClose={() => setEditExamDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>تعديل الاختبار</DialogTitle>
        <DialogContent className="space-y-4 mt-2">
          <input
            type="text"
            placeholder="اسم الاختبار"
            className="border p-2 rounded w-full"
            value={examFormData.name}
            onChange={(e) =>
              setExamFormData({ ...examFormData, name: e.target.value })
            }
          />
          <textarea
            placeholder="الوصف"
            className="border p-2 rounded w-full"
            rows={3}
            value={examFormData.description}
            onChange={(e) =>
              setExamFormData({ ...examFormData, description: e.target.value })
            }
          />
          <input
            type="datetime-local"
            className="border p-2 rounded w-full"
            value={examFormData.date}
            onChange={(e) =>
              setExamFormData({ ...examFormData, date: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <div className="flex gap-2">
            <button
              className="bg-gray-600 cursor-pointer text-white p-2 rounded-lg"
              onClick={() => setEditExamDialogOpen(false)}
            >
              إلغاء
            </button>
            <Button
              onClick={handleExamEditSubmit}
              color="primary"
              variant="contained"
            >
              حفظ
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      {editQuestion && (
        <EditQuestionDialog
          question={editQuestion}
          onClose={() => setEditQuestion(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default OneExam;
