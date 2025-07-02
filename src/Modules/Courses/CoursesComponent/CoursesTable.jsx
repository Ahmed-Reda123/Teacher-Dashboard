import { useTheme } from "@emotion/react";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

function CoursesTable({ courses, handleToggleCourse, togglingId }) {
  const theme = useTheme();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const openConfirmDialog = (id) => {
    setSelectedCourseId(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedCourseId(null);
  };
  const handleConfirmDelete = async () => {
    setDeletingId(selectedCourseId);
    setConfirmDialogOpen(false);
    const toastId = toast.loading("جاري حذف الكورس...");

    try {
      await axios.delete(`/api/courses/${selectedCourseId}`);
      toast.success("تم حذف الكورس بنجاح", { id: toastId });

      // Optionally: refetch or manually remove course from UI
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف", { id: toastId });
    } finally {
      setDeletingId(null);
      setSelectedCourseId(null);
    }
  };
  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      {courses.length === 0 ? (
        <Alert severity="warning">لا يوجد بيانات</Alert>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="upcoming table">
              <TableHead>
                <TableRow
                  sx={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: theme.palette.primary.main,
                    zIndex: 1,
                  }}
                >
                  {[
                    "الإسم",
                    "الوصف",
                    "الفصل الدراسي",
                    "السعر",
                    "السنة",
                    "رقم المادة",
                    "اسم المعلم",
                    "الحالة",
                    "التحكم",
                    "حذف",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link
                        to={`/course/${item.id}`}
                        className="flex items-center gap-2"
                      >
                        {item.name} <FaExternalLinkAlt />
                      </Link>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {item.term === "FIRST" ? "الاول" : "الثاني"}
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>{item.materialId}</TableCell>
                    <TableCell>
                      {item.Teacher.firstName} {item.Teacher.lastName}{" "}
                    </TableCell>
                    <TableCell>
                      {item.active ? (
                        <span className="text-white bg-green-400 rounded-lg p-1 lg:text-md text-sm" dir="rtl">
                          نشط
                        </span>
                      ) : (
                        <span className="text-white bg-red-500 rounded-lg p-1 lg:text-md text-sm" dir="rtl">
                          غير نشط
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        id={`switch-${item.id}`}
                        name="active"
                        checked={item.active}
                        onClick={() => handleToggleCourse({ id: item.id })}
                        color="primary"
                        disabled={togglingId === item.id}
                      />
                    </TableCell>
                    <TableCell>
                      <MdDelete
                        style={{
                          cursor:
                            deletingId === item.id ? "not-allowed" : "pointer",
                          color: "red",
                          opacity: deletingId === item.id ? 0.5 : 1,
                        }}
                        size={24}
                        onClick={() => openConfirmDialog(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogContent>
              هل أنت متأكد أنك تريد حذف هذا الكورس؟ لا يمكن التراجع.
            </DialogContent>
            <DialogActions>
              <div className="flex gap-2">
                <button
                  className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
                  onClick={closeConfirmDialog}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                  disabled={deletingId === selectedCourseId}
                >
                  حذف
                </button>
              </div>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
}

export default CoursesTable;
