import {
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Box,
  LinearProgress,
  styled,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";

const HiddenInput = styled("input")({
  display: "none",
});

function FileSelector({ file, onFileChange }) {
  return (
    <label
      htmlFor="file-upload"
      className="flex items-center justify-center cursor-pointer border-2 border-dashed border-green-600 rounded-lg p-6 hover:bg-green-50 transition-colors"
    >
      <Typography
        variant="body1"
        className="text-green-800 font-semibold"
        component="span"
      >
        {file
          ? `الملف المختار: ${file.name}`
          : "اختر ملف للتحميل (حتى 1 جيجابايت)"}
      </Typography>
      <HiddenInput
        accept="*"
        id="file-upload"
        type="file"
        onChange={onFileChange}
      />
    </label>
  );
}

function UploadProgress({ progress }) {
  return (
    <Box className="w-full">
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" className="text-right mt-1 text-green-700">
        {`جاري الرفع: ${progress}%`}
      </Typography>
    </Box>
  );
}

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("يرجى اختيار ملف.");
      return;
    }

    const formData = new FormData();
    formData.append("category", "GLOBAL");
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadProgress(0);
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/local/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          },
        }
      );

      sessionStorage.setItem("uploadedFileId", data.data);
      toast.success("تم رفع الملف بنجاح!");
      setUploadProgress(100);
      setFile(null);

      // Move to next step after upload success
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error);
      toast.error("فشل في رفع الملف");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <FileSelector file={file} onFileChange={handleFileChange} />
      {loading && <UploadProgress progress={uploadProgress} />}
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={handleFileUpload}
          disabled={loading || !file}
          className="bg-main p-2 text-white rounded-lg cursor-pointer"
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "رفع الملف"
          )}
        </button>
        <Link
          to="/course"
          className="bg-gray-300 p-2 rounded-lg"
          onClick={() => setFile(null)}
        >
          إلغاء
        </Link>
      </div>
    </div>
  );
}

function AddLesson() {
  const { id: partId } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState(1);
  const [publicLesson, setPublicLesson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, 2));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmitLesson = async () => {
    const fileId = sessionStorage.getItem("uploadedFileId");

    if (!name || !description || !number || !fileId) {
      return toast.error("يرجى إكمال جميع الحقول.");
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/lessons`,
        {
          name,
          description,
          number,
          partId: parseInt(partId),
          fileId,
          public: publicLesson,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("تم إضافة الدرس بنجاح!");
      sessionStorage.removeItem("uploadedFileId");
      setActiveStep(0);
      setName("");
      setDescription("");
      setNumber(1);
      setPublicLesson(false);
    } catch (err) {
      console.error(err);
      toast.error("فشل في إضافة الدرس");
    } finally {
      setLoading(false);
      sessionStorage.removeItem("uploadedFileId");
    }
  };

  return (
    <div
      dir="rtl"
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
    >
      <Typography
        variant="h5"
        gutterBottom
        className="text-center mb-6 font-bold"
      >
        إضافة درس جديد
      </Typography>

      {activeStep === 0 && <FileUpload onUploadSuccess={handleNext} />}

      {activeStep === 1 && (
        <div className="space-y-5">
          <TextField
            fullWidth
            label="اسم الدرس"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            inputProps={{ style: { textAlign: "right" } }}
          />
          <TextField
            fullWidth
            label="الوصف"
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ style: { textAlign: "right" } }}
          />
          <TextField
            fullWidth
            label="رقم الدرس"
            margin="normal"
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            inputProps={{ style: { textAlign: "right" } }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={publicLesson}
                onChange={() => setPublicLesson(!publicLesson)}
                color="success"
              />
            }
            label="عام"
            labelPlacement="start"
            sx={{ justifyContent: "flex-end", width: "100%" }}
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              السابق
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="space-y-4">
          <Typography variant="h6" className="font-bold mb-4 text-right">
            المعاينة
          </Typography>
          <div className="text-right">
            <p>
              <strong>اسم الدرس:</strong> {name}
            </p>
            <p>
              <strong>الوصف:</strong> {description}
            </p>
            <p>
              <strong>رقم الدرس:</strong> {number}
            </p>
            <p>
              <strong>عام:</strong> {publicLesson ? "نعم" : "لا"}
            </p>
            <p>
              <strong>اسم الملف:</strong>{" "}
              {sessionStorage.getItem("uploadedFileId")
                ? "تم تحميل ملف"
                : "لم يتم اختيار ملف"}
            </p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              السابق
            </button>
            <button
              onClick={handleSubmitLesson}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "إرسال الدرس"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddLesson;
