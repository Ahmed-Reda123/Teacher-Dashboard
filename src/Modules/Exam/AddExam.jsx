import { SimpleRichEditor } from "../../Components/Formatter";

function AddExam() {

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-100 p-4">
        <h1>Add exam</h1>
        <SimpleRichEditor />
    </div>
  );
}

export default AddExam;
