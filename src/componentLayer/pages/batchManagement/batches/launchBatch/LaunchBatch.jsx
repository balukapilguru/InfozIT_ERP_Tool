import { useState, useRef, useEffect } from "react";
// import Button from "../../../../components/button/Button";
import BackButton from "../../../../components/backbutton/BackButton";
import BatchOverview from "./BatchOverview";
import BatchCurriculum from "./BatchCurriculum";
// import CompletedTopics from "./CompletedTopics";
import BatchStudentsList from "./BatchStudentsList";
import BatchAttendance from "./BatchAttendance";
import { useLocation, useParams } from "react-router-dom";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import BatchRecordings from "./BatchRecordings";
import Exam from "./Exam.jsx";
import Media from "./Media.jsx";
const LaunchBatch = () => {
  const { batchId } = useParams();
  const { batchType } = useParams();
const location = useLocation();
const {trainingMode} = location.state || {}

  const [activeButton, setActiveButton] = useState("toggle-button2");
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      event.target.id !== "searchInput"
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [activeTabs, setActiveTabs] = useState({
    batchOverview: false,
    curriculum: false,
    attendances: false,
    studentsDetails: false,
    recordings: false,
    exam: false,
    media: false
  });

  const handleTabs = (tab) => {
    setActiveTabs({
      batchOverview: tab === "batchOverview",
      curriculum: tab === "curriculum",
      attendances: tab === "attendances",
      studentsDetails: tab === "studentsDetails",
      recordings: tab === "recordings",
      exam: tab === "exam",
      media: tab === "media"
    });
  };

  const [BatchState, setBatchState] = useState({});
  const [BatchState2, setBatchState2] = useState({});

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (batchId) {
  //       try {
  //         const { data, status } = await ERPApi.get(
  //           `${import.meta.env.VITE_API_URL}/batch/getbatch/${batchId}`
  //         );
  //         if (status === 200) {
  //           setBatchState(data?.getById);
  //           setBatchState2(data);
  //         }
  //       } catch (error) { }
  //     }
  //   };
  //   fetchData();
  // }, [batchId]);

  useEffect(() => {
    const fetchData = async () => {
      if (batchId) {
        try {
          const { data, status } = await ERPApi.get(
            `${import.meta.env.VITE_API_URL}/batch/getbatch/${batchId}`
          );

          if (status === 200) {
            const trainingMode = data?.getById?.trainingMode;

            setBatchState(data?.getById);
            setBatchState2(data);

            // ✅ Set default active tab based on trainingMode
            if (trainingMode === "self-learning") {
              setActiveTabs({
                batchOverview: false,
                curriculum: false,
                attendances: false,
                studentsDetails: false,
                recordings: false,
                exam: false,
                media: true, // ✅ Open Course Content
              });
            } else {
              setActiveTabs({
                batchOverview: false,
                curriculum: true, // ✅ Open Curriculum
                attendances: false,
                studentsDetails: false,
                recordings: false,
                exam: false,
                media: false,
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch batch data:", error);
        }
      }
    };

    fetchData();
  }, [batchId]);


  return (
    <div>
      <BackButton heading="Launch" content="Back" to="/" />
      <div className="container-fluid mt-3">
        {/* tabs start */}
        <ul
          className="nav mb-3 nav-tabs d-flex justify-content-center"
          id="pills-tab"
          role="tablist"
        >
          {trainingMode !== "self-learning" && (
            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${activeTabs.curriculum ? "active" : ""
                  }`}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTabs.curriculum}
                onClick={() => handleTabs("curriculum")}
              >
                Curriculum
              </button>
            </li>
          )}
          {batchType !== "upcoming" && trainingMode !== "self-learning" && (

            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${activeTabs.attendances ? "active" : ""
                  }`}
                id="pills-user-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-user"
                type="button"
                role="tab"
                aria-controls="pills-user"
                aria-selected={activeTabs.attendances}
                onClick={() => handleTabs("attendances")}
              >
                Attendance
              </button>
            </li>

          )}

          {batchType !== "upcoming" && trainingMode !== "self-learning" && (

            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${activeTabs.recordings ? "active" : ""
                  }`}
                id="pills-launch-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-launch"
                type="button"
                role="tab"
                aria-controls="pills-launch"
                aria-selected={activeTabs.recordings}
                onClick={() => handleTabs("recordings")}
              >
                Live Recordings
              </button>
            </li>

          )}

          <button
            className={`card card_animate nav-link ms-3 ${activeTabs.media ? "active" : ""}`}
            id="pills-media-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-media"
            type="button"
            role="tab"
            aria-controls="pills-media"
            aria-selected={activeTabs.media}
            onClick={() => handleTabs("media")}
          >
            Course Content
          </button>

          <li className="nav-item" role="presentation">
            <button
              className={`card card_animate nav-link ms-3 ${activeTabs.studentsDetails ? "active" : ""
                }`}
              id="pills-launch-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-launch"
              type="button"
              role="tab"
              aria-controls="pills-launch"
              aria-selected={activeTabs.studentsDetails}
              onClick={() => handleTabs("studentsDetails")}
            >
              Student Details
            </button>
          </li>


          {batchType !== "upcoming" && (
            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${activeTabs.exam ? "active" : ""
                  }`}
                id="pills-exam-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-exam"
                type="button"
                role="tab"
                aria-controls="pills-exam"
                aria-selected={activeTabs.exam}
                onClick={() => handleTabs("exam")}
              >
                Exam
              </button>
            </li>
          )}

          <li className="nav-item" role="presentation">
            <button
              className={`card card_animate nav-link ms-3 ${activeTabs.batchOverview ? "active" : ""
                }`}
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected={activeTabs.batchOverview}
              onClick={() => handleTabs("batchOverview")}
            >
              Batch Overview
            </button>
          </li>
        </ul>

        <div className="">
          <div className="">
            <div className="tab-content" id="pills-tabContent">
              {/* batch OverView */}
              {activeTabs?.batchOverview && (
                <div
                  className={`tab-pane fade ${activeTabs.batchOverview ? "show active" : ""
                    }`}
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                  tabIndex="0"
                >
                  <div className="">
                    {BatchState && batchId && BatchState2 && (
                      <BatchOverview
                        batchId={batchId}
                        BatchState={BatchState}
                        setBatchState={setBatchState}
                        BatchState2={BatchState2}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* curriculum */}
              {activeTabs?.curriculum && (
                <div
                  className={`tab-pane fade ${activeTabs.curriculum ? "show active" : ""
                    }`}
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchCurriculum
                      BatchState={BatchState}
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </div>
                </div>
              )}

              {/* Attendance */}
              {activeTabs?.attendances && (
                <div
                  className={`tab-pane fade ${activeTabs.attendances ? "show active" : ""
                    }`}
                  id="pills-user"
                  role="tabpanel"
                  aria-labelledby="pills-user-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchAttendance />
                  </div>
                </div>
              )}

              {/* Media */}
              {/* Course Content (Media) - CORRECTED */}
              {activeTabs?.media && (
                <div
                  className={`tab-pane fade ${activeTabs.media ? "show active" : ""}`}
                  id="pills-media"
                  role="tabpanel"
                  aria-labelledby="pills-media-tab"
                >
                  <Media curriculumId={BatchState?.curriculum?.id} />
                </div>
              )}

              {/* student Details */}
              {activeTabs.studentsDetails && (
                <div
                  className={`tab-pane fade ${activeTabs.studentsDetails ? "show active" : ""
                    }`}
                  id="pills-launch"
                  role="tabpanel"
                  aria-labelledby="pills-launch-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchStudentsList
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </div>
                </div>
              )}

              {/* Exam */}
              {activeTabs.exam && (
                <div
                  className={`tab-pane fade ${activeTabs.exam ? "show active" : ""
                    }`}
                  id="pills-exam"
                  role="tabpanel"
                  aria-labelledby="pills-exam-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <Exam
                      BatchState={BatchState}
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </div>
                </div>
              )}
              {activeTabs.recordings && (
                <div
                  className={`tab-pane fade ${activeTabs.recordings ? "show active" : ""
                    }`}
                  id="pills-launch"
                  role="tabpanel"
                  aria-labelledby="pills-launch-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchRecordings batchId={batchId} batchType={batchType} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchBatch;
