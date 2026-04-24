import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import QRCodeGenerator from "../../../../../utils/QRCodeGenerator";

const MarkAttendance = ({ show, handleClose, BatchState }) => {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [presentStudents, setPresentStudents] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (BatchState?.id) {
        setLoading((prev) => !prev);
        try {
          const [students, presentStudentsList] = await Promise.all([
            ERPApi.get(`/batch/getstudents?batchId=${BatchState?.id}`),
            ERPApi.get(
              `/batch/attendance?trainerId=${
                BatchState?.users[0]?.id
              }&batchId=${
                BatchState?.id
              }&date=${new Date().toLocaleDateString()} `
            ),
          ]);

          if (students?.status === 200 && presentStudentsList?.status === 200) {
            setStudentList(students?.data?.reversedStudents);
            setPresentStudents(presentStudentsList?.data?.attendance);
          }
        } catch (error) {
          console.error(error)
        } finally {
          setLoading((prev) => !prev);
        }
      }
    };
    fetchData();
  }, [BatchState?.id]);

  const handleSubmitAttendance = async (id) => {
    if (id) {
      const body = {
        batchId: BatchState?.id,
        studentId: id,
        trainerId: BatchState?.users[0]?.id,
      };
      setAttendanceLoading((prev) => !prev);
      try {
        const { data, status } = await ERPApi.post(`/batch/attendance`, body);
        if (status === 201) {
          if (presentStudents?.includes(id)) {
            let updatedStudents = [...presentStudents];
            updatedStudents = updatedStudents?.filter((item) => item !== id);
            setPresentStudents(updatedStudents);
          } else {
            let updatedStudents = [...presentStudents];
            updatedStudents?.push(id);
            setPresentStudents(updatedStudents);
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setAttendanceLoading((prev) => !prev);
      }
    }
  };
  const [showList, setShowList] = useState(false);
  let todayDate = new Date();
  todayDate =
    todayDate.getFullYear() +
    "-" +
    String(todayDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(todayDate.getDate()).padStart(2, "0");

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="md"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Mark Attendance :{new Date().toLocaleDateString()}</h5>
        </Modal.Title>
        <button
          className="btn btn_primary fs-13 ms-5"
          onClick={() => setShowList((prev) => !prev)}
        >
          {showList && <span>Show QR</span>}
          {!showList && <span>Hide QR</span>}
        </button>
      </Modal.Header>
      <Modal.Body>
        {showList && (
          <div className="card-body">
            <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
              <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr className="">
                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                      S.No
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                      Students Name
                    </th>
                    <th
                      scope="col"
                      className="fs-13 lh-xs fw-600 text-truncate"
                    >
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentList && studentList?.length > 0 ? (
                    loading ? (
                      <tr>
                        <td className="fs-13 black_300  lh-xs bg_light">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      studentList?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                              {index + 1}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {item?.name}
                            </td>

                            <td className="fs-13 black_300 lh-xs bg_light ">
                              <div
                                className="form-check form-switch"
                                style={{
                                  cursor: attendanceLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  disabled={attendanceLoading === true}
                                  id={`flexSwitchCheckChecked-${item.id}`}
                                  checked={presentStudents?.includes(item?.id)}
                                  onChange={() =>
                                    handleSubmitAttendance(item?.id)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )
                  ) : (
                    <tr>
                      <td className="fs-13 black_300  lh-xs bg_light">
                        no data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!showList && (
          <div className="card-body">
            <QRCodeGenerator
              data={`BatchId=${BatchState?.id},date=${todayDate}`}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MarkAttendance;
