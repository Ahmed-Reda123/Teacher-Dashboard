import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function AddQuestion() {
  const { id: examId } = useParams();

  const [formData, setFormData] = useState({
    question: "",
    writtenAnswer: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: null,
    truOrFalseAnswer: false,
    type: "WRITTEN",
    examId: Number(examId),
    score: 1,
    order: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("جاري الإرسال...");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/questions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تمت إضافة السؤال بنجاح", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في الإضافة", {
        id: toastId,
      });
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Paper elevation={3} className="p-6 ">
        <Typography variant="h6" gutterBottom>
          إضافة سؤال
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Question Type */}
          <TextField
            label="نوع السؤال"
            name="type"
            select
            value={formData.type}
            onChange={handleChange}
            fullWidth
            sx={{
              marginY: 2,
            }}
          >
            <MenuItem value="WRITTEN">مقالي (WRITTEN)</MenuItem>
            <MenuItem value="MULTIPLE_CHOICE">اختيار من متعدد</MenuItem>
            <MenuItem value="TRUE_FALSE">صح أو خطأ</MenuItem>
          </TextField>

          {/* Common Fields */}
          <TextField
            label="السؤال"
            name="question"
            value={formData.question}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            required
            sx={{
              marginY: 2,
            }}
          />

          {formData.type === "WRITTEN" && (
            <TextField
              label="الإجابة النموذجية"
              name="writtenAnswer"
              value={formData.writtenAnswer}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={4}
              required
              sx={{
                marginY: 2,
              }}
            />
          )}

          {formData.type === "MULTIPLE_CHOICE" && (
            <>
              <TextField
                label="الخيار A"
                name="optionA"
                value={formData.optionA}
                onChange={handleChange}
                fullWidth
                sx={{
                  marginY: 2,
                }}
              />
              <TextField
                label="الخيار B"
                name="optionB"
                value={formData.optionB}
                onChange={handleChange}
                fullWidth
                sx={{
                  marginY: 2,
                }}
              />
              <TextField
                label="الخيار C"
                name="optionC"
                value={formData.optionC}
                onChange={handleChange}
                fullWidth
                sx={{
                  marginY: 2,
                }}
              />
              <TextField
                label="الخيار D"
                name="optionD"
                value={formData.optionD}
                onChange={handleChange}
                fullWidth
                sx={{
                  marginY: 2,
                }}
              />
              <TextField
                label="الخيار الصحيح"
                name="correctOption"
                select
                value={formData.correctOption}
                onChange={handleChange}
                fullWidth
                sx={{
                  marginY: 2,
                }}
              >
                <MenuItem value={0}>A</MenuItem>
                <MenuItem value={1}>B</MenuItem>
                <MenuItem value={2}>C</MenuItem>
                <MenuItem value={3}>D</MenuItem>
              </TextField>
            </>
          )}

          {formData.type === "TRUE_FALSE" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.truOrFalseAnswer}
                  onChange={handleChange}
                  name="truOrFalseAnswer"
                />
              }
              label="الإجابة صحيحة؟"
            />
          )}

          {/* Score & Order */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="الدرجة"
              name="score"
              type="number"
              value={formData.score}
              onChange={handleChange}
              fullWidth
              sx={{
                marginY: 2,
              }}
            />
            <TextField
              label="الترتيب"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              fullWidth
              sx={{
                marginY: 2,
              }}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="contained" color="primary">
              إضافة السؤال
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}

export default AddQuestion;
