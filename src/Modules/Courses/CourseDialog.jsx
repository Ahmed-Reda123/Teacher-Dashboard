// components/Courses/CourseDialog.jsx
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

const CourseDialog = ({ open, onClose, onSubmit, formData, onChange, materials }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>أضف كورس جديد</DialogTitle>
      <div className="flex flex-col justify-center items-center py-2 px-4 gap-2">
        {["name", "description", "term", "price", "year", "materialId"].map((field) => (
          field === "term" ? (
            <select
              key={field}
              name={field}
              value={formData[field]}
              onChange={onChange}
              className="w-full outline-none border-2 border-gray-300 p-2 rounded-lg"
            >
              <option value="">الفصل الدراسي</option>
              <option value="FIRST">الأول</option>
              <option value="SECOND">الثاني</option>
            </select>
          ) : field === "materialId" ? (
            <select
              key={field}
              name={field}
              value={formData[field]}
              onChange={onChange}
              className="w-full outline-none border-2 border-gray-300 p-2 rounded-lg"
            >
              <option value="">اختر المادة</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              key={field}
              className="w-full outline-none border-2 border-gray-300 p-2 rounded-lg"
              name={field}
              type="text"
              value={formData[field]}
              onChange={onChange}
              placeholder={
                field === "name" ? "اسم الدورة" :
                field === "description" ? "الوصف" :
                field === "price" ? "أضف السعر" :
                field === "year" ? "العام الدراسي" :
                ""
              }
            />
          )
        ))}
      </div>
      <DialogActions>
        <div className="flex justify-center items-center gap-2">
          <button onClick={onClose} className="bg-gray-700 text-white p-2 rounded-lg cursor-pointer">
            Cancel
          </button>
          <Button onClick={onSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDialog;
