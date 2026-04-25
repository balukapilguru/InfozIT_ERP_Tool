import React from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { FaWpforms } from 'react-icons/fa'
import BackButton from '../../../components/backbutton/BackButton'
import { ERPApi } from '../../../../serviceLayer/interceptor'
import CountUp from '../../../../utils/CountUp'

export const ticketDashboardLoader = async ({ request }) => {
  const url = new URL(request.url);
  const selectedStatus = url.searchParams.get("status");

  try {
    const response = await ERPApi.post(`/ticket/count`, {
      status: selectedStatus !== "Received" ? selectedStatus : "",
    });
    const ticketCountData = response.data;
    return ticketCountData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const TicketDashboard = () => {
  const navigate = useNavigate()
  const ticketCountData = useLoaderData();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStatus = searchParams.get("status") || "";

  const handleStatusClick = (status) => {
    if (status === "Received") {
      setSearchParams({});
    } else {
      setSearchParams({ status });
    }
  };
  const statusColors = {
    Received: "#a9cce3 ",
    Open: "#fdebd0  ",
    Resolved: "#d0ece7 ",
    Unresolved: "#fadbd8  ",
    Pending: "#f9e79f  ",
    Inprogress: "#d2b4de   ",
  };

  return (
    <div>
      <BackButton heading="Issues Dashboard" content="Back" />
      <div className="container-fluid">
        <style>
          {`
    .card_animate[data-status="Received"] { background-color: #a9cce3 !important; color: #000 !important; }
    .card_animate[data-status="Open"] { background-color: #fdebd0 !important; color: #000 !important; }
    .card_animate[data-status="Resolved"] { background-color: #d0ece7 !important; color: #000 !important; }
    .card_animate[data-status="Unresolved"] { background-color: #fadbd8 !important; color: #000 !important; }
    .card_animate[data-status="Pending"] { background-color: #f9e79f !important; color: #000 !important; }
    .card_animate[data-status="Inprogress"] { background-color: #d2b4de !important; color: #000 !important; }
    
    /* Ensure text inside button is also white */
    .card_animate p, 
    .card_animate h4, 
    .card_animate span {
      color: #000 !important;
    }

    /* Apply specific colors for the SVG icon */
    .card_animate[data-status="Received"] svg { color: #2980b9 !important; }  /* Dark Blue */
    .card_animate[data-status="Open"] svg { color: #e67e22 !important; }  /* Orange */
    .card_animate[data-status="Resolved"] svg { color: #1abc9c !important; }  /* Teal */
    .card_animate[data-status="Unresolved"] svg { color: #e74c3c !important; }  /* Red */
    .card_animate[data-status="Pending"] svg { color: #f1c40f !important; }  /* Yellow */
    .card_animate[data-status="Inprogress"] svg { color: #8e44ad !important; }  /* Purple */
  `}
        </style>



        <ul className="row nav mb-3 nav-tabs nav-justified mb-3 nav-fill mt-2" id="pills-tab">
          {["Received", "Open", "Resolved", "Unresolved", "Pending", "Inprogress"].map((status) => (
            <li key={status} className="col-xxl-1 col-xl-1 col-lg-1 col-md-6 col-sm-12 col-12 nav-item mt-2">
              <button
                className={`card nav-link card_animate ${selectedStatus === status ? "active" : ""}`}
                onClick={() => handleStatusClick(status)}
                data-status={status} // Assigning data attribute for CSS
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      {status}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                  <div className="text-start">
                    <h4 className="fs-22 fw-semibold ff-secondary mb-4 display_no">
                      <CountUp finalValue={ticketCountData?.branchStatusCounts?.[status] || 0} duration={300} />
                    </h4>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-success-subtle rounded fs-6 p-2">
                      <FaWpforms className="text-success fs-20" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className='container-fluid'>
        <div className="card-body  bg-white">
          <div className="table-responsive table-card table-container table-scroll border-0">
            <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
              <thead>
                <tr>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "20px" }}>S.No</th>
                  <th scope="col" className="fs-13 lh-xs fw-600">Branch</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Total Count'>Total Count</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>Recordings</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Trainer Issues'>Trainer Issues</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Counsellor Issues'>Counsellor Issues</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>Id Card</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Certificate'>Certificates</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>IEP</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Batch Shiftings'>Batch Shiftings</th>
                  <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>Others</th>
                </tr>
              </thead>
              <tbody>
                {ticketCountData?.branches?.map((item, index) => (
                  <tr key={item.id} style={{ cursor: "pointer" }}>
                    <td className='fs-13 black_300 lh-xs bg_light' >{index + 1}</td>
                    <td className='fs-13 black_300 lh-xs bg_light text-truncate' style={{ maxWidth: "50px" }} title={item.branch_name} onClick={() => navigate(`/tickets/list?branch=${item.id}&status=${selectedStatus}`)} >{item.branch_name}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{Object.values(item.branchIssueTypeCounts).reduce((acc, count) => acc + count, 0)}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.Recordings || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["Trainer Issues"] || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["Counsellor Issues"] || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["ID Card"] || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.Certificates || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.IEP || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["Batch Shifting"] || 0}</td>
                    <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.Others || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default TicketDashboard