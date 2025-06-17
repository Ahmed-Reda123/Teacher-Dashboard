import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";

function EditQuestionDialog({ question, onClose, onSave }) {
  const [formData, setFormData] = React.useState(question || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={!!question} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>تعديل السؤال</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="السؤال"
            name="question"
            value={formData.question || ""}
            onChange={handleChange}
            fullWidth
          />

          {formData.type === "MULTIPLE_CHOICE" && (
            <>
              <TextField
                label="الخيار A"
                name="optionA"
                value={formData.optionA || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="الخيار B"
                name="optionB"
                value={formData.optionB || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="الخيار C"
                name="optionC"
                value={formData.optionC || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="الخيار D"
                name="optionD"
                value={formData.optionD || ""}
                onChange={handleChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>الإجابة الصحيحة</InputLabel>
                <Select
                  name="correctOption"
                  value={formData.correctOption ?? ""}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>A</MenuItem>
                  <MenuItem value={1}>B</MenuItem>
                  <MenuItem value={2}>C</MenuItem>
                  <MenuItem value={3}>D</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {formData.type === "TRUE_FALSE" && (
            <FormControlLabel
              control={
                <Checkbox
                  name="truOrFalseAnswer"
                  checked={formData.truOrFalseAnswer || false}
                  onChange={handleChange}
                />
              }
              label="صحيح"
            />
          )}

          {formData.type === "WRITTEN" && (
            <TextField
              label="الإجابة النموذجية"
              name="writtenAnswer"
              value={formData.writtenAnswer || ""}
              onChange={handleChange}
              fullWidth
            />
          )}

          <TextField
            label="الدرجة"
            name="score"
            type="number"
            value={formData.score || ""}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose} className="bg-gray-600 text-white cursor-pointer p-2 mx-2 rounded-lg ">
          إلغاء
        </button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditQuestionDialog;
