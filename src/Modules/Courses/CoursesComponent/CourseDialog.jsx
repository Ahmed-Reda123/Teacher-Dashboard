// components/Courses/CourseDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Switch,
} from "@mui/material";

const CourseDialog = ({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  materials,
}) => {
  console.log("m",materials);
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>أضف كورس جديد</DialogTitle>
      <div className="flex flex-col justify-center items-center py-2 px-4 gap-2">
        {[
          "name",
          "description",
          "term",
          "price",
          "year",
          "materialId",
          "active",
        ].map((field) =>
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
                  {material.Material.name}
                </option>
              ))}
            </select>
          ) : field === "active" ? (
            <div
              key={field}
              className="w-full flex justify-between items-center border-2 border-gray-300 p-2 rounded-lg"
            >
              <label htmlFor="active">نشط</label>
              <Switch
                id="active"
                name="active"
                checked={formData.active}
                onChange={(e) =>
                  onChange({
                    target: {
                      name: "active",
                      value: e.target.checked,
                    },
                  })
                }
                color="primary"
              />
            </div>
          ) : (
            <input
              key={field}
              className="w-full outline-none border-2 border-gray-300 p-2 rounded-lg"
              name={field}
              type="text"
              value={formData[field]}
              onChange={onChange}
              placeholder={
                field === "name"
                  ? "اسم الدورة"
                  : field === "description"
                  ? "الوصف"
                  : field === "price"
                  ? "أضف السعر"
                  : field === "year"
                  ? "العام الدراسي"
                  : ""
              }
            />
          )
        )}
      </div>
      <DialogActions>
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white p-2 rounded-lg cursor-pointer"
          >
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
