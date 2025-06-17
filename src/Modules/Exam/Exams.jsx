import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../redux/Apis/Exams";
import Loading from "../../Components/Loading/Loading";
import { MdDeleteOutline } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
function Exams() {
  const dispatch = useDispatch();

  const { exams, loading, error } = useSelector((state) => state.exams);

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
    <div className="p-4">
     <div className="flex justify-between items-center ">
         <h2 className="text-xl font-bold mb-4">الاختبارات</h2>
         <Link to={'/addexam'} className="bg-main flex justify-center items-center rounded p-1 text-white">أضافة اختبار</Link>
     </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <ul className="space-y-2">
          {exams.length === 0 ? (
            <li>No exams found.</li>
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
                  <button className="flex justify-center items-center rounded gap-1 bg-red-500 p-2 text-white">
                    حذف الاختبار <MdDeleteOutline />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default Exams;
