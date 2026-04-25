import React, { useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "../../../components/button/Button";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../../../components/backbutton/BackButton";
import { LeadSourceContext } from "../../../../dataLayer/context/leadSourceContext/LeadSourceContext";

import { useLeadSourceContext } from "../../../../dataLayer/hooks/useLeadSourceContext";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

const CreateLeadSource = () => {
  const { leadSourceState, DispatchLeadSource, getAllLeadSource } =
    useLeadSourceContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leadsource: "",
  });
  const [createdBy, setCreatedBy] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    return userData || "";
  });

  const [error, setError] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Fetch lead source name if available for editing

      ERPApi.get(`${import.meta.env.VITE_API_URL}/settings/getleadsource/${id}`)
        .then((response) => {
          setFormData({
            leadsource: response?.data?.leadsource || "",
          });
        })
        .catch((error) => {
          console.error("Error lead details:", error);
        });
    }
  }, [id]);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setError((prev) => ({
      ...prev,
      [name]: "", // Reset error for the field being changed
    }));
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.leadsource ||
      formData.leadsource.trim() === "" ||
      formData.leadsource.length < 3
    ) {
      setError((prev) => ({
        ...prev,
        leadsource: "Please enter the lead source (min 3 characters)",
      }));
      return;
    }
    let user = {
      leadsource: formData.leadsource,
      createdby: createdBy?.user?.fullname,
    };
    user = [user];

    const dataWithTitleCase = user.map((item) => {
      const newItem = {};

      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (typeof item[key] === "string" && key !== "email") {
            newItem[key] = item[key]
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          } else {
            newItem[key] = item[key];
          }
        }
      }
      return newItem;
    });
    user = dataWithTitleCase[0];

    if (!id) {
      try {
        // * posting the data if the id is not present
        const { data, status } = await toast.promise(
          ERPApi.post(
            `${import.meta.env.VITE_API_URL}/settings/addleadsource`,
            user
          ),
          {
            loading: "Loading...",
            success: "LeadSource created Successfully",
            error: "LeadSource not Created",
          }
        );

        if (status === 201) {
          DispatchLeadSource({ type: "CREATE_LEAD_SOURCE", payload: data });
          getAllLeadSource();
          navigate("/settings/leadsource");
        }
      } catch (error) { }
    }

    if (id) {
      try {
        const { data, status } = await toast.promise(
          ERPApi.put(
            `${import.meta.env.VITE_API_URL}/settings/updateleadsource/${id}`,
            user
          ),
          {
            loading: "Loading...",
            success: "LeadSource updated Successfully",
            error: "LeadSource not updated",
          }
        );

        if (status === 200) {
          DispatchLeadSource({ type: "CREATE_LEAD_SOURCE", payload: data });
          getAllLeadSource();
          navigate("/settings/leadsource");
        }
      } catch (error) { }
    }
  };
  return (
    <div>
      {id && id ? (
        <BackButton heading="Update Lead Source" content="Back" />
      ) : (
        <BackButton heading="Create Lead Source" content="Back" />
      )}
      {/* <BackButton heading=  "Create Lead Source"  content="Back"  /> */}
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-5">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label
                      for="firstNameinput"
                      className="form-label fs-s fw-medium black_300"
                    >
                      Lead Source<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={
                        error && error.leadsource
                          ? "form-control fs-s bg-form text_color input_bg_color error-input"
                          : "form-control fs-s bg-form text_color input_bg_color"
                      }
                      placeholder="Enter Lead Source"
                      id="firstNameinput"
                      name="leadsource"
                      onChange={handlechange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); 
                        }
                      }}
                      value={formData.leadsource}
                    />
                    <div style={{ height: "8px" }}>
                      {error && error.leadsource && (
                        <p className="text-danger m-0 fs-xs">
                          {error.leadsource}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className=" ">
                    <div className="d-flex justify-content-end">
                      <Button onClick={handleSubmit} className="btn_primary" type="submit">
                        {id ? "Update" : "Submit"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeadSource;
