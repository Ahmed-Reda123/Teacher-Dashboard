import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function AddPart() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    description: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddPart = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      number: Number(formData.number),
      courseId: Number(id),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/parts`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("تمت إضافة الجزء بنجاح");
      setFormData({ name: '', number: '', description: '' }); // reset form
      navigate(`/course/${id}`); // redirect to course page
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في إضافة الجزء");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg text-right">
      <Toaster />

      <h2 className="text-2xl font-bold mb-6">إضافة جزء جديد للدورة رقم {id}</h2>

      <form onSubmit={handleAddPart} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">اسم الجزء</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">رقم الجزء</label>
          <input
            type="number"
            name="number"
            className="w-full border p-2 rounded"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">الوصف</label>
          <textarea
            name="description"
            className="w-full border p-2 rounded"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          إضافة الجزء
        </button>
      </form>
    </div>
  );
}

export default AddPart;
