import { useEffect, useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import { useFetcher, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
import { IoMdArrowBack } from "react-icons/io";

const CreateLearnerCompany = () => {
    const learnerCompany = useLoaderData();
    const { id } = useParams();
    const { theme } = useTheme();
    const fetcher = useFetcher();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(1);
    const [errors, setErrors] = useState({});
    const [BranchFrom, setBranchFrom] = useState(() => (
        id
            ? {
                learner_company: learnerCompany?.learner_company || "",
                description: learnerCompany?.description || "",
            }
            : {
                learner_company: "",
                description: "",
            }
    ));
    const validateForm = () => {
        const newErrors = {};

        // ✅ Validate company name first
        if (!BranchFrom.learner_company.trim()) {
            newErrors.learner_company = "Company name is required.";
            setErrors(newErrors);
            return false;
        } else if (BranchFrom.learner_company.trim().length < 3) {
            newErrors.learner_company = "Company name must be at least 3 characters.";
            setErrors(newErrors);
            return false;
        }

        // ✅ Then validate description
        if (!BranchFrom.description.trim()) {
            newErrors.description = "Description is required.";
            setErrors(newErrors);
            return false;
        } else if (BranchFrom.description.trim().length < 3) {
            newErrors.description = "Description must be at least 3 characters.";
            setErrors(newErrors);
            return false;
        }

        // ✅ If no errors
        setErrors({});
        return true;
    };


    // Handle the final submit (JSON)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return; // stop form submission if validation fails
        }

        const MethodType = id ? "PUT" : "POST";
        try {
            await fetcher.submit(BranchFrom, {
                method: MethodType,
                encType: "application/json",
            });
        } catch (error) {
            console.error("Learner Company submission error:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setBranchFrom((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            const status = fetcher.data.status;
            const type = fetcher.data.type;
            if (
                (status === 200 || status === 201) &&
                (type === "COMPANY_CREATION" || type === "COMPANY_UPDATE")
            ) {
                navigate("/settings/learnerCompany");
            }
        }
    }, [fetcher.state, fetcher.data, navigate]);

    return (
        <div>
            <BackButton
                heading={id ? "Update Company" : "Create Company"}
                content="Back"
            />
            <div className="container-fluid">
                <div className="registration_form_section">
                    <div className="top">
                        <div className="registration_form_tabs row">
                            <div className="button_grp col-lg-12 p-0">
                                <button
                                    type="button"
                                    className={
                                        activeTab === 1
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn"
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Company Details
                                </button>
                                {/* <button
                                    type="button"
                                    className={
                                        activeTab === 2
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn"
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Preview
                                </button> */}
                            </div>
                            <div className="bottom mt-3">
                                <form onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); 
                                        return false; 
                                    }
                                }}>
                                    {activeTab === 1 && (
                                        <>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label
                                                            htmlFor="learner_company"
                                                            className="form-label fs-s fw-medium black_300"
                                                        >
                                                            Company Name <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={
                                                                errors.learner_company
                                                                    ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                                    : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                            }
                                                            placeholder="Enter Company Name"
                                                            id="learner_company"
                                                            name="learner_company"
                                                            onChange={handleChange}
                                                            value={BranchFrom.learner_company}
                                                        />
                                                        <div style={{ height: "8px" }}>
                                                            {errors.learner_company && (
                                                                <p className="text-danger m-0 fs-xs">
                                                                    {errors.learner_company}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label
                                                            htmlFor="description"
                                                            className="form-label fs-s fw-medium black_300"
                                                        >
                                                            Description<span className="text-danger">*</span>
                                                        </label>
                                                        <textarea
                                                            className={
                                                                errors.description
                                                                    ? "form-control fs-s bg-form text_color input_bg_color error-input"
                                                                    : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                            }
                                                            placeholder="Enter the Description"
                                                            id="description"
                                                            name="description"
                                                            value={BranchFrom.description}
                                                            onChange={handleChange}
                                                        />
                                                        <div style={{ height: "8px" }}>
                                                            {errors.description && (
                                                                <p className="text-danger m-0 fs-xs">
                                                                    {errors.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="controls d-flex justify-content-between mt-4">
                                                <div></div>
                                                <Button
                                                    type="button"
                                                    className="btn right btn_primary"
                                                    onClick={handleSubmit}
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLearnerCompany;
