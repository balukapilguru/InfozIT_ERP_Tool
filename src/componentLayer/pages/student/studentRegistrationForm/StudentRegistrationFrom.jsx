

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../../dataLayer/context/themeContext/ThemeContext";
import {
    IoMdArrowBack,
    IoMdCheckmark,
    IoMdArrowForward,
    IoMdSend,
} from "react-icons/io";
import "../../../../assets/css/RegistrationForm.css";
import { MdDelete } from "react-icons/md";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import {
    useFetcher,
    useLoaderData,
    useNavigate,
    useNavigation,
    useSearchParams,
    useSubmit,
} from "react-router-dom";
import { debounce } from "../../../../utils/Utils";
import Select from "react-select";
import { toast } from "react-toastify";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import Swal from "sweetalert2";
import { IoChevronDownSharp } from "react-icons/io5";

const StudentRegistrationFrom = () => {
    const data = useLoaderData();
    const { coursePackageList, BranchsList, leadSourceList,
        active,
        courseData,
        coursepackageIdparams,
    } = data;

    const submit = useSubmit();
    const fetcher = useFetcher();
    const navigate = useNavigate();



    const userData = JSON.parse(localStorage.getItem("data"));
    const currentYear = new Date().getFullYear();

    const { theme } = useTheme();
    const [query, setQuerys] = useState({
        active: active ? active : 1,
        coursepackageId: coursepackageIdparams ? coursepackageIdparams : null,
    });

    console.log(fetcher, "fdhgdfdfdsf")

    const coursesList =
        courseData?.map((item, index) => ({
            label: item.course_name,
            value: item.id,
        })) || [];


    // const [coursePackageListData, setCoursePackageListData] = useState([
    //     { label: "IIT Certification Program", value: 31 },
    //     { label: "Job Oriented Training Program", value: 29 },
    //     { label: "Module Certification Program - Vizag", value: 27 },
    //     { label: "IIT Certification Program - Vizag", value: 26 },
    //     { label: "Job Oriented Training Program - Vizag", value: 25 },
    //     { label: "Employment Program - Vizag", value: 24 },
    //     { label: "Employment Program", value: 18 },
    //     { label: "Module Certification Program", value: 17 },

    // ]);

    const coursePackageListData = coursePackageList
        ?.filter(item => item.isToggle === 1)
        .map(item => ({ label: item.label, value: item.value }));

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        debouncedParams(query);
    }, [query]);

    const debouncedParams = useCallback(
        debounce((param) => {
            const searchParams = new URLSearchParams({
                active: param?.active,
                coursepackageId: param?.coursepackageId,
            }).toString();
            submit(`?${searchParams}`, { method: "get", action: "." });
        }, 200),
        []
    );

    const handleNext = () => {
        setQuerys((prev) => ({
            ...prev,
            active: active + 1,
        }));
    };
    const handlePrev = () => {
        setQuerys((prev) => ({
            ...prev,
            active: active - 1,
        }));
    };



    const [errors, setErrors] = useState({});

    const [countdown, setCountDown] = useState(0);

    const [emailVerificationState, setEmailVerificationState] = useState({
        email: "",
        enableOTPInputFeild: false,
        emailOTP: Array(6).fill(""),
        otpVerified: false,
    });


    console.log(emailVerificationState, "emailVerificationState")
    const inputRefs = useRef([]);

    const handleInputChangeEmail = (e, index) => {
        const { value } = e.target;

        setErrors((prev) => ({
            ...prev,
            emailOTP: "",
        }))
        if (/^[0-9]?$/.test(value)) { // Allow only digits
            const newOTP = [...emailVerificationState.emailOTP];
            newOTP[index] = value;
            setEmailVerificationState((prev) => ({
                ...prev,
                emailOTP: newOTP,
            }))
            // Move to the next input field if a digit is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleFocus = (index) => {
        inputRefs.current[index].select(); // Select the current input text when focused
    };

    const handleKeyDownemail = (e, index) => {
        if (e.key === "Backspace" && !emailVerificationState.emailOTP[index] && index > 0) {
            inputRefs.current[index - 1].focus(); // Move to the previous input field on backspace
        }
    };

    // useEffect(() => {
    //     if (countdown > 0) {
    //         const timer = setInterval(() => {
    //             setCountDown((prev) => prev - 1)
    //         }, 1000);
    //         return () => clearInterval(timer); // Cleanup interval on unmount or countdown reset
    //     }
    // }, [countdown]);

    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };



    const [studentDetails, setStudentDetails] = useState({
        name: "",
        email: "",
        imageFile: "",
        filename: "",
        imagePerview: "",
        imgData: "",
        aadharCardImage: "",
        aadharCardImageData: "",
        aadharImagePerview: "",
        aadharImageFile: "",
        aadharCardNumber: "",
        birthdate: "",
        mobilenumber: "",
        whatsappno: "",
        gender: "",
        maritalstatus: "",
        college: "",
        zipcode: "",
        country: "",
        state: "",
        native: "",
        area: "",
    });




    const [parentsDetails, setParentsDetails] = useState({
        parentsname: "",
        parentsnumber: "",
    });

    const [educationDetails, setEducationDetails] = useState({
        educationtype: "",
        marks: "",
        academicyear: "",
    });

    const [admissionDetails, setAdmissionDetails] = useState({
        enquirydate: "",
        enquirytakenby: "",
        enquirytakenbyId: "",
        coursepackage: "",
        coursepackageId: "",
        courses: "",
        coursesId: "",
        leadsource: [],
        leadsourceId: "",
        branch: "",
        branchId: "",
        modeoftraining: "",
        admissiondate: "",
        validitystartdate: "",
        validityenddate: "",
        user_id: null,
    });

    const [feeData, setFeeData] = useState({
        id: null,
        feetype: "",
        amount: 0,
        discount: 0,
        taxamount: 0,
        totalamount: 0,
    });

    console.log(feeData, "feeDatafdf");

    const [feeAndBillingDetails, setFeeAndBillingDetails] = useState({
        feedetails: [],
        feedetailsbilling: [],
        addfee: false,
        duedatetype: "",
        admissionremarks: "",
        assets: [],
        tshirtSize: "",
        installments: [],
        totalpaidamount: 0,
        nextduedate: null,
        status: 1,
        admissionFee: [],
        initialpayment: [],
        extra_discount: [],
        student_status: [],
        refund: null,
        certificate_status: [
            {
                courseStartDate: "",
                courseEndDate: "",
                certificateStatus: "",
                requistedDate: "",
                issuedDate: "",
            },
        ],
        totalinstallments: 0,
    });

    console.log(feeAndBillingDetails, "feeAndBillingDetails");

    console.log(studentDetails, parentsDetails, educationDetails, admissionDetails, feeAndBillingDetails,)

    useEffect(() => {

        const storedemailVerificationState = localStorage.getItem("emailVerificationState")
        const storedStudentDetails = localStorage.getItem("studentDetails");
        const storedParentDetails = localStorage.getItem("parentsDetails");
        const storedEducationDetails = localStorage.getItem("educationDetails");
        const storedAdmissionDetails = localStorage.getItem("admissionDetails");
        const stroedFeeAndBillingDetails = localStorage.getItem("feeAndBillingDetails");
        const userData = JSON.parse(localStorage.getItem("data"));

        if (userData) {
            setAdmissionDetails((prev) => ({
                ...prev,
                enquirytakenby: userData?.user?.fullname,
                enquirytakenbyId: userData?.user?.id,
                branch: userData?.user?.branch_setting?.branch_name,
                branchId: userData?.user?.branch_setting?.id,
                user_id: userData?.user?.id,
            }));
        }
        if (storedemailVerificationState) {
            setEmailVerificationState(JSON.parse(storedemailVerificationState))
        }

        if (storedStudentDetails) {
            setStudentDetails(JSON.parse(storedStudentDetails));
        }
        if (storedParentDetails) {
            setParentsDetails(JSON.parse(storedParentDetails));
        }
        if (storedEducationDetails) {
            setEducationDetails(JSON.parse(storedEducationDetails));
        }
        if (storedAdmissionDetails) {
            setAdmissionDetails(JSON.parse(storedAdmissionDetails));
        }
        if (stroedFeeAndBillingDetails) {
            setFeeAndBillingDetails(JSON.parse(stroedFeeAndBillingDetails));
        }

        // return () => {
        //     localStorage.removeItem("emailVerificationState");
        //     localStorage.removeItem("studentDetails");
        //     localStorage.removeItem("parentsDetails");
        //     localStorage.removeItem("educationDetails");
        //     localStorage.removeItem("admissionDetails");
        //     localStorage.removeItem("feeAndBillingDetails");
        // };

    }, []);

    const handleSendOTPtoEmail = async () => {
        if (!studentDetails.email) {
            setErrors((prev) => ({ ...prev, email: "Email is required" }));
            return;
        } else {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!emailPattern.test(studentDetails?.email)) {
                setErrors((prev) => ({ ...prev, email: "Invalid Email Address" }));
                return;
            }
        }
        try {

            const updatedData = {
                email: studentDetails?.email,
                type: "SEND_OTP_TO_EMAIL"
            }

            await fetcher.submit(updatedData, {
                method: "POST",
                encType: "application/json"
            })

        }
        catch (error) {
            console.error(error)
        }
    }


    const handleVerifyOTP = async () => {
        const OtpString = emailVerificationState?.emailOTP?.join(""); // Ensure OTP exists as a string
        const OtpNumber = OtpString ? Number(OtpString) : null;

        if (!OtpNumber || OtpString.length !== 6) {
            setErrors((prev) => ({ ...prev, emailOTP: "OTP must be 6 digits long" }));
            return;
        }

        try {
            const updatedData = {
                email: studentDetails?.email,
                emailOtp: OtpString, // Ensure OTP is sent as a string
                type: "VERIFY_OTP_TO_EMAIL",
            };

            await fetcher.submit(updatedData, {
                method: "POST",
                encType: "application/json",
            });

        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };

    const handleInputChange = async (event, inputType) => {
        try {
            if (active === 2 || active === 1) {
                const { name, value } = event.target;

                setErrors((prev) => ({
                    ...prev,
                    [name]: "",
                }))

                if (name === "filename") {
                    const file = event.target.files[0];


                    if (file) {
                        const maxSize = 2 * 1024 * 1024; // 2 MB

                        // ✅ File size validation
                        if (file.size > maxSize) {
                            setErrors((prev) => ({
                                ...prev,
                                filename: "File size must be 2 MB or less",
                            }));

                            event.target.value = null; // clear the input
                            return; // stop execution
                        } else {
                            // clear previous error if valid file chosen
                            setErrors((prev) => ({
                                ...prev,
                                filename: "",
                            }));
                        }
                    }

                    // Check if the file type is PNG
                    // if (file && file.type !== "image/png") {
                    //     alert("Please upload a PNG file.");
                    //     return; // Exit early if the file is not a PNG
                    // }

                    setStudentDetails((prev) => ({
                        ...prev,
                        filename: file.name,
                        imageFile: file,
                    }));

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const photoData = reader.result.split(",")[1];
                        setStudentDetails((prev) => ({
                            ...prev,
                            imagePerview: reader.result,
                            imgData: photoData,
                        }));
                    };
                    reader.readAsDataURL(file);
                }

                else if (name === "aadharCardImage") {
                    const file = event.target.files[0];

                    // Check if the file type is PNG
                    // if (file && file.type !== "image/png") {
                    //     alert("Please upload a PNG file for the Aadhar Card image.");
                    //     return; // Exit early if the file is not a PNG
                    // }

                    if (file) {
                        const maxSize = 2 * 1024 * 1024; // 2 MB

                        // ✅ File size validation
                        if (file.size > maxSize) {
                            setErrors((prev) => ({
                                ...prev,
                                aadharCardImage: "File size must be 2 MB or less",
                            }));

                            event.target.value = null; // clear input
                            return; // stop further processing
                        } else {
                            // clear previous error
                            setErrors((prev) => ({
                                ...prev,
                                aadharCardImage: "",
                            }));
                        }
                    }

                    setStudentDetails((prev) => ({
                        ...prev,
                        aadharCardImage: file.name,
                        aadharImageFile: file,
                    }));

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const photoData = reader.result.split(",")[1];
                        setStudentDetails((prev) => ({
                            ...prev,
                            aadharImagePerview: reader.result,
                            aadharCardImageData: photoData,
                        }));
                    };
                    reader.readAsDataURL(file);
                }

                else if (name === "email") {
                    setStudentDetails((prevState) => ({ ...prevState, email: value }));
                    setEmailVerificationState((prev) => ({
                        ...prev,
                        otpVerified: false,
                        enableOTPInputFeild: false,
                    }))
                }
                else {
                    setStudentDetails((prevState) => ({ ...prevState, [name]: value }));
                }
            } else if (active === 3) {

                const { name, value } = event.target;
                setErrors((prev) => ({
                    ...prev,
                    [name]: "",
                }))
                setParentsDetails((prevState) => ({ ...prevState, [name]: value }));
            } else if (active === 4) {
                const { name, value } = event.target;
                setErrors((prev) => ({
                    ...prev,
                    [name]: "",
                }))
                setEducationDetails((prevState) => ({ ...prevState, [name]: value }));
            } else if (active === 5) {

                if (inputType) {
                    setErrors((prev) => ({
                        ...prev,
                        [inputType]: "",
                    }))
                }


                if (inputType === "enquirytakenby") {
                    setAdmissionDetails((prev) => ({
                        ...prev,
                        enquirytakenby: event.label,
                        enquirytakenbyId: parseInt(event.value),
                    }));
                } else if (inputType === "coursepackage") {
                    setAdmissionDetails((prev) => ({
                        ...prev,
                        coursepackage: event.label,
                        coursepackageId: parseInt(event.value),
                        courses: "",
                        coursesId: "",
                    }));

                    setQuerys((prev) => ({
                        ...prev,
                        coursepackageId: event.value,
                        active: active,
                    }));
                } else if (inputType === "branch") {
                    setAdmissionDetails((prev) => ({
                        ...prev,
                        branch: event.label,
                        branchId: parseInt(event.value),
                    }));
                } else if (inputType === "courses") {
                    setAdmissionDetails((prev) => ({
                        ...prev,
                        courses: event.label,
                        coursesId: parseInt(event.value),
                    }));
                    setFeeAndBillingDetails((prev) => ({
                        ...prev,
                        feedetails: [],
                    }));
                } else if (inputType === "leadsource") {
                    setAdmissionDetails((prev) => ({
                        ...prev,
                        leadsource: [
                            {
                                source: event.label,
                            },
                        ],
                        leadsourceId: parseInt(event?.value) || "",
                    }));
                } else {
                    const { name, value } = event.target;
                    setErrors((prev) => ({
                        ...prev,
                        [name]: "",
                    }))
                    if (name == "validitystartdate") {
                        const startDate = new Date(value);
                        const endDate = new Date(startDate);
                        endDate.setFullYear(endDate.getFullYear() + 1);
                        const formattedEndDate = endDate.toISOString().split("T")[0];
                        setAdmissionDetails((prev) => ({
                            ...prev,
                            validitystartdate: value,
                            validityenddate: formattedEndDate,
                        }));
                    }
                    setAdmissionDetails((prevState) => ({ ...prevState, [name]: value }));
                }
            } else if (active === 6) {
                const { name, value } = event.target;

                setErrors((prev) => ({
                    ...prev,
                    [name]: "",
                }))
                if (name === "feetype" && value === "Admission Fee") {
                    setFeeData({
                        id: Date.now(),
                        feetype: value,
                        amount: 500,
                        discount: 0,
                    });
                } else if (name === "feetype" && value === "fee") {
                    let course = courseData.filter((course) => {
                        return course.id === admissionDetails?.coursesId;
                    });
                    setFeeData({
                        id: Date.now(),
                        feetype: value,
                        amount: course[0].fee,
                        discount: 0,
                    });
                } else if (name === "discount") {

                    if (feeData.feetype === "Admission Fee") {
                        if (parseInt(value) > 500) {
                            return;
                        } else {
                            setFeeData((prev) => ({
                                ...prev,
                                discount: parseInt(value),
                            }));
                        }
                    }
                    else if (feeData.feetype === "fee") {
                        setFeeData((prev) => ({
                            ...prev,
                            discount: parseInt(value),
                        }));
                    }

                } else {
                    setFeeData((prevState) => ({
                        ...prevState,
                        [name]: parseInt(value),
                    }));
                }
            } else if (active === 8) {

                const { id, name, checked, value } = event.target

                setErrors((prev) => ({
                    ...prev,
                    [name]: "",
                }))

                setFeeAndBillingDetails((prev) => {
                    const currentAssets = Array.isArray(prev.assets) ? prev.assets : []; // Ensure assets is an array
                    if (inputType === 'checkbox') {
                        setFeeAndBillingDetails((prevDetails) => {
                            const updatedAssets = checked
                                ? [...prevDetails.assets, id]
                                : prevDetails.assets.filter((asset) => asset !== id);

                            // If 'mac' is unchecked, reset 'tshirtSize'
                            if (id === 'mac' && !checked) {
                                return {
                                    ...prevDetails,
                                    assets: updatedAssets,
                                    tshirtSize: '', // Reset t-shirt size when mac is unchecked
                                };
                            }

                            return {
                                ...prevDetails,
                                assets: updatedAssets,
                            };
                        });
                    } else if (id === 'tshirtSize') {
                        setFeeAndBillingDetails((prevDetails) => ({
                            ...prevDetails,
                            tshirtSize: value,
                        }));
                    } else {
                        // Handle other input types if you have them
                        setFeeAndBillingDetails((prevDetails) => ({
                            ...prevDetails,
                            [id]: value,
                        }));
                    }
                    if (name === "admissionremarks") {
                        return { ...prev, admissionremarks: value };
                    } else {
                        const updatedAssets = checked
                            ? [...currentAssets, name] // Add asset
                            : currentAssets.filter((asset) => asset !== name); // Remove asset

                        return { ...prev, assets: updatedAssets };
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const relevantCoursePackageIds = [31, 26, 19];

    const shouldShowMacAndTshirt = relevantCoursePackageIds.includes(
        admissionDetails.coursepackageId
    );
    const handleFeeDetails = (e) => {
        e.preventDefault();
        if (!feeData.feetype) {
            setErrors((prev) => ({ ...prev, feetype: "Fee type is required" }));
            return;
        }

        if (!feeData?.amount) {
            setErrors((prev) => ({ ...prev, amount: "Amount is required" }));
            return;
        }
        const existingAdmissionFee = feeAndBillingDetails?.feedetails.some(
            (item) => item.feetype === "Admission Fee"
        );
        const existingRegularFee = feeAndBillingDetails?.feedetails?.some(
            (item) => item.feetype === "fee"
        );

        // Validate that only one admission fee and one regular fee are allowed
        if (feeData.feetype === "Admission Fee" && existingAdmissionFee) {
            toast.error("Admission Fee is only accepted once.");
            return;
        }
        if (feeData.feetype === "fee" && existingRegularFee) {
            toast.error("Fee is only Allowed Once");
            return;
        }
        let save = true;
        if (feeData.feetype === "fee") {
            let course = courseData.filter(
                (course) =>
                    course.course_name === admissionDetails?.courses &&
                    course.course_package === admissionDetails?.coursepackage
            );

            if (
                course.length > 0 &&
                parseInt(feeData.discount ? feeData.discount : 0) >
                parseInt(course[0].max_discount) &&
                course[0].course_name === admissionDetails?.courses &&
                course[0].course_package === admissionDetails?.coursepackage
            ) {
                save = false;
                toast.error(
                    `Discount cannot be greater than ${course[0].max_discount}`
                );
            }
        }
        if (save) {
            const DiscountAmount = feeData?.discount || 0;
            const totalAmount = feeData?.amount - DiscountAmount;
            const actualFee = (totalAmount * 100) / 118;
            const taxAmount = totalAmount - actualFee;
            setFeeData((prev) => ({
                ...prev,
                taxamount: taxAmount,
                totalamount: totalAmount,
            }));

            setFeeAndBillingDetails((prev) => ({
                ...prev,
                feedetails: [
                    ...prev.feedetails,
                    {
                        id: Date.now(),
                        feetype: feeData.feetype,
                        amount: feeData.amount,
                        discount: DiscountAmount,
                        taxamount: taxAmount,
                        totalamount: totalAmount,
                    },
                ],
            }));
            setFeeData({
                id: null,
                feetype: "",
                amount: 0,
                discount: 0,
                taxamount: 0,
                totalamount: 0,
            });
        }
    };

    const handleFeeDelete = (id) => {
        const updatedTasks = feeAndBillingDetails.feedetails.filter(
            (task) => task.id !== id
        );
        setFeeAndBillingDetails((prev) => ({
            ...prev,
            feedetails: updatedTasks,
        }));
    };


    const handleFeecalculations = () => {
        function validateFeedetails(feedetails) {
            const admissionFeeExists = feedetails.some(
                (item) => item.feetype === "Admission Fee"
            );
            const feeExists = feedetails.some((item) => item.feetype === "fee");

            return admissionFeeExists && feeExists;
        }

        if (!validateFeedetails(feeAndBillingDetails?.feedetails || [])) {
            setErrors((prev) => ({
                ...prev,
                feetype: "Fee type is required",
                amount: "Amount is required",
            }));
            return;
        }

        let grosstotal = 0;
        let totaldiscount = 0;
        let totalfeewithouttax = 0;
        let totaltax = 0;
        let grandtotal = 0;
        let materialfee = 0;
        const array = [];

        feeAndBillingDetails?.feedetails?.forEach((item) => {
            if (item.feetype === "Admission Fee") {
                let admissionObject = {
                    id: item.id,
                    feetype: "Admission Fee",
                    feewithtax: item.totalamount,
                    feewithouttax: item.totalamount / 1.18,
                    feetax: item.totalamount - item.totalamount / 1.18,
                };

                grosstotal += parseInt(item.amount);
                totalfeewithouttax += admissionObject.feewithouttax;
                totaltax += admissionObject.feetax;
                grandtotal += admissionObject.feewithtax;
                array.push(admissionObject);
            }

            if (item.feetype === "fee") {
                let courseFeeObject = {
                    id: item.id,
                    feetype: "Course Fee",
                    feewithtax: item.totalamount * 0.7,
                    feewithouttax: (item.totalamount * 0.7) / 1.18,
                    feetax: item.totalamount * 0.7 - (item.totalamount * 0.7) / 1.18,
                };

                grosstotal += Math.round(item.amount * 0.7);
                totaldiscount += parseInt(item.discount * 0.7);
                totalfeewithouttax += courseFeeObject.feewithouttax;
                totaltax += courseFeeObject.feetax;
                grandtotal += courseFeeObject.feewithtax;
                array.push(courseFeeObject);

                let materialFeeObject = {
                    id: item.id,
                    feetype: "Material Fee",
                    feewithtax: Math.round(item.totalamount * 0.3),
                    feewithouttax: Math.round(item.totalamount * 0.3),
                    feetax: 0,
                };

                grosstotal += parseInt(item.amount * 0.3);
                totaldiscount += parseInt(item.discount * 0.3);
                materialfee += Math.round(item.totalamount * 0.3);
                totaltax += materialFeeObject.feetax;
                array.push(materialFeeObject);
            }
        });

        const finalTotal = grandtotal + materialfee;

        setFeeAndBillingDetails((prev) => {
            const updatedDetails = {
                ...prev,
                feedetailsbilling: array,
                totaldiscount,
                grosstotal,
                totalfeewithouttax,
                totaltax,
                grandtotal,
                materialfee,
                finaltotal: finalTotal,
                dueamount: finalTotal,
            };

            localStorage.setItem(
                "feeAndBillingDetails",
                JSON.stringify(updatedDetails)
            );
            return updatedDetails;
        });

        if (feeAndBillingDetails?.feedetails?.length === 0) {
            toast.error("Please enter fee details");
            return;
        }

        handleSubmitFeeAndBillingDetails();
    };

    const handleSubmitStudentDetails = () => {

        if (!studentDetails?.name) {
            setErrors((prev) => ({ ...prev, name: "Name is required" }));
            return;
        } else if (studentDetails?.name.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                name: "Name should have 3 or more characters",
            }));
            return;
        }
        if (!studentDetails?.email) {
            setErrors((prev) => ({ ...prev, email: "Email is required" }));
            return;
        } else {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!emailPattern.test(studentDetails?.email)) {
                setErrors((prev) => ({ ...prev, email: "Invalid Email Address" }));
                return;
            }
        }

        if (!studentDetails?.filename || !studentDetails?.imgData) {
            setErrors((prev) => ({ ...prev, filename: "Image is required" }));
            return;
        }

        if (!studentDetails?.birthdate) {
            setErrors((prev) => ({ ...prev, birthdate: "Date of birth is required" }));
            return;
        }

        if (!studentDetails?.mobilenumber) {
            setErrors((prev) => ({ ...prev, mobilenumber: "Moblie Number is required" }));
            return;
        } else {
            if (studentDetails?.mobilenumber?.length !== 10) {
                setErrors((prev) => ({
                    ...prev,
                    mobilenumber: "Incorrect Mobile number",
                }));
                return;
            }
        }

        if (!studentDetails?.whatsappno) {
            setErrors((prev) => ({ ...prev, whatsappno: "WhatsApp Number required" }));
            return;
        } else {
            if (studentDetails?.whatsappno.length !== 10) {
                setErrors((prev) => ({
                    ...prev,
                    whatsappno: "Incorrect WhatsApp number",
                }));
                return;
            }
        }

        if (!studentDetails?.gender) {
            setErrors((prev) => ({ ...prev, gender: "Gender is required" }));
            return;
        }

        if (!studentDetails?.maritalstatus) {
            setErrors((prev) => ({
                ...prev,
                maritalstatus: "Marital status is required",
            }));
            return;
        }

        if (!studentDetails?.college) {
            setErrors((prev) => ({ ...prev, college: "college is required" }));
            return;
        } else if (studentDetails?.college.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                college: "college must be at least 3 characters long",
            }));
            return;
        }
        if (!studentDetails?.aadharCardImage || !studentDetails?.aadharCardImageData) {
            setErrors((prev) => ({ ...prev, aadharCardImage: "Image is required" }));
            return;
        }

        if (!studentDetails?.aadharCardNumber) {
            setErrors((prev) => ({ ...prev, aadharCardNumber: "Aadhar number is required" }));
            return;
        } else if (studentDetails?.aadharCardNumber.length !== 12) {
            setErrors((prev) => ({
                ...prev,
                aadharCardNumber: "Aadhar number be exactly 12 characters long",
            }));
            return;
        }
        if (!studentDetails?.zipcode) {
            setErrors((prev) => ({ ...prev, zipcode: "Pincode is required" }));
            return;
        } else if (studentDetails?.zipcode.length !== 6) {
            setErrors((prev) => ({
                ...prev,
                zipcode: "Pincode must be exactly 6 characters long",
            }));
            return;
        }
        if (!studentDetails?.country) {
            setErrors((prev) => ({ ...prev, country: "Country is required" }));
            return;
        } else if (studentDetails?.country.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                country: "Country must be at least 3 characters long",
            }));
            return;
        }
        if (!studentDetails?.state) {
            setErrors((prev) => ({ ...prev, state: "state is required" }));
            return;
        } else if (studentDetails?.state.length < 3) {
            setErrors((prev) => ({
                ...prev,
                state: "State must be at least 3 characters long",
            }));
            return;
        }
        if (!studentDetails?.native) {
            setErrors((prev) => ({ ...prev, native: "native is required" }));
            return;
        } else if (studentDetails?.native.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                native: "Native Place must be at least 3 characters long",
            }));
            return;
        }
        if (!studentDetails?.area) {
            setErrors((prev) => ({ ...prev, area: "Area is required" }));
            return;
        } else if (studentDetails?.area.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                area: "Area must be at least 3 characters long",
            }));
            return;
        }

        localStorage.setItem("studentDetails", JSON.stringify(studentDetails));
        handleNext();
    };

    const handleSubmitParentDetails = () => {

        if (!parentsDetails?.parentsname) {
            setErrors((prev) => ({
                ...prev,
                parentsname: "parentsname is required",
            }));
            return;
        } else if (parentsDetails?.parentsname.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                parentsname: "parentsname must be at least 3 characters long",
            }));
            return;
        }

        if (!parentsDetails?.parentsnumber) {
            setErrors((prev) => ({
                ...prev,
                parentsnumber: "Parent Number is required",
            }));

            return;
        } else {
            if (parentsDetails?.parentsnumber.trim().replace(/\s+/g, '').length !== 10) {
                setErrors((prev) => ({
                    ...prev,
                    parentsnumber: "Number is invalid",
                }));
                return;
            }
        }
        localStorage.setItem("parentsDetails", JSON.stringify(parentsDetails));
        handleNext();
    };

    const handleSubmitEducationDetails = () => {

        if (!educationDetails?.educationtype) {
            setErrors((prev) => ({
                ...prev,
                educationtype: "Education type is required",
            }));
            return;
        }
        if (!educationDetails?.marks) {
            setErrors((prev) => ({
                ...prev,
                marks: "Percentage is required",
            }));
            return;
        }
        const year = parseInt(educationDetails?.academicyear?.slice(0, 4));
        const currentYear = new Date().getFullYear();

        if (!year || year === 0 || year > currentYear) {
            setErrors((prev) => ({
                ...prev,
                academicyear: "Enter valid year",
            }));
            return;
        }



        localStorage.setItem("educationDetails", JSON.stringify(educationDetails));
        handleNext();
    };

    const handleSubmitAdmissionDetails = () => {

        if (!admissionDetails?.enquirydate) {
            setErrors((prev) => ({
                ...prev,
                enquirydate: "Enquiry Date is required",
            }));
            return;
        } else if (!admissionDetails?.enquirytakenby) {
            setErrors((prev) => ({
                ...prev,
                enquirytakenby: "Enquiry Taken by is required",
            }));
            return;
        } else if (!admissionDetails?.coursepackage) {
            setErrors((prev) => ({
                ...prev,
                coursepackage: "Course Package is required",
            }));
            return;
        } else if (!admissionDetails?.courses) {
            setErrors((prev) => ({ ...prev, courses: "Courses is required" }));
            return;
        } else if (!admissionDetails?.leadsource[0]?.source) {
            setErrors((prev) => ({
                ...prev,
                leadsource: "Lead Source is required",
            }));
            return;
        }

        else if (!admissionDetails?.branch) {
            setErrors((prev) => ({ ...prev, branch: "Branch is required" }));
            return;
        } else if (!admissionDetails?.modeoftraining) {
            setErrors((prev) => ({
                ...prev,
                modeoftraining: "Mode of Training is required",
            }));
            return;
        } else if (!admissionDetails?.admissiondate) {
            setErrors((prev) => ({
                ...prev,
                admissiondate: "Admission Date is required",
            }));
            return;
        } else if (!admissionDetails?.validitystartdate) {
            setErrors((prev) => ({
                ...prev,
                validitystartdate: "Validity Start Date is required",
            }));
            return;
        } else if (!admissionDetails?.validityenddate) {
            setErrors((prev) => ({
                ...prev,
                validityenddate: "Validity End Date is required",
            }));
            return;
        }

        localStorage.setItem("admissionDetails", JSON.stringify(admissionDetails));
        handleNext();
    };

    const handleSubmitFeeAndBillingDetails = () => {
        // localStorage.setItem("feeAndBillingDetails", JSON.stringify(feeAndBillingDetails));
        handleNext();
    };

    const handleSubmitOtherDetails = () => {

        if (!feeAndBillingDetails?.admissionremarks) {
            setErrors((prev) => ({ ...prev, admissionremarks: "Admission Remarks is required" }));
            return;
        } else if (feeAndBillingDetails?.admissionremarks.trim().replace(/\s+/g, '').length < 3) {
            setErrors((prev) => ({
                ...prev,
                admissionremarks: "Admission Remarks must be at least 3 characters long",
            }));
            return;
        }

        localStorage.setItem("feeAndBillingDetails", JSON.stringify(feeAndBillingDetails));
        handleNext();
    };



    const handleSubmitSubmitEnrollement = async () => {
        const enrollementData = {
            ...studentDetails,
            ...parentsDetails,
            ...educationDetails,
            ...admissionDetails,
            ...feeAndBillingDetails,
        }


        console.log(enrollementData, "updatedDatadjhjfd")

        const updatedData = {
            enrollementData: enrollementData,
            type: "CREATE_ENROLLEMENT"
        }


        try {

            await fetcher.submit(updatedData, {
                method: "POST",
                encType: "application/json"
            })



        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data) {
            if (fetcher.data.type === "SEND_OTP_TO_EMAIL") {
                setEmailVerificationState((prev) => {
                    if (
                        !prev.enableOTPInputFeild ||
                        prev.otpVerified ||
                        prev.emailOTP.some((otp) => otp !== "")
                    ) {
                        return {
                            ...prev,
                            enableOTPInputFeild: true,
                            otpVerified: false,
                            emailOTP: Array(6).fill(""),
                        };
                    }
                    return prev; // Prevents re-render if the state is the same
                });

                setCountDown(5 * 60);
                Swal.fire({
                    title: "Email Sent Successfully!",
                    text: "An OTP has been sent to your registered email address. Please check your inbox (or spam folder) and use the OTP to proceed.",
                    icon: "success",
                });
            }

            if (fetcher.data.type === "VERIFY_OTP_TO_EMAIL") {
                setEmailVerificationState((prev) => {
                    if (prev.enableOTPInputFeild || !prev.otpVerified) {
                        const updatedState = {
                            ...prev,
                            enableOTPInputFeild: false,
                            otpVerified: true,
                        };
                        localStorage.setItem("emailVerificationState", JSON.stringify(updatedState));
                        return updatedState;
                    }
                    return prev;
                });
                localStorage.setItem("studentDetails", JSON.stringify(studentDetails));
                setQuerys((prev) => ({
                    ...prev,
                    active: active + 1,
                }));

                Swal.fire({
                    title: "OTP Verified Successfully!",
                    text: "You have successfully verified your email address.",
                    icon: "success",
                });
            }

            // CREATE_ENROLLEMENT
            if (fetcher?.data?.type === "CREATE_ENROLLEMENT") {

                const updatedData = fetcher?.data?.data;
                const studentId = updatedData?.studentId
                navigate(`/student/feeUpdate?studentId=${studentId}`)
                localStorage.removeItem("emailVerificationState");
                localStorage.removeItem("studentDetails");
                localStorage.removeItem("parentsDetails");
                localStorage.removeItem("educationDetails");
                localStorage.removeItem("admissionDetails");
                localStorage.removeItem("feeAndBillingDetails");
                Swal.fire({
                    title: "Enrollement Successful!",
                    text: "Enrollement has been submitted successfully.",
                    icon: "success",
                });
            }


        }
    }, [fetcher.state, fetcher.data]);


    return (
        <div>
            <BackButton heading="Registration Form" content="Back" to="/" />
            <div className="container-fluid">
                <div className="registration_form_section  ">
                    <div className="top">
                        <div className="registration_form_tabs row">
                            <div className="button_grp col-lg-12 p-0">
                                <button
                                    type="button"
                                    className={
                                        active === 1
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100 "
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn"
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Email
                                </button>

                                <button
                                    type="button"
                                    className={
                                        active === 2
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100 "
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn"
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Student Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 3
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Parent Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 4
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Education Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 5
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Admission Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 6
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Fee Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 7
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Billing Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 8
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Others Details
                                </button>
                                <button
                                    type="button"
                                    className={
                                        active === 9
                                            ? `${theme === "light"
                                                ? "form_tab_btn active w-100"
                                                : "form_tab_btn dark active"
                                            }`
                                            : "form_tab_btn "
                                    }
                                    style={{ cursor: "auto" }}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bottom mt-3">
                        <form
                            className=""
                        // onSubmit={handleSubmit}
                        >
                            {/* email */}

                            {active === 1 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="email"
                                            >
                                                Email<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.email
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                placeholder="Enter the Email Address"
                                                value={studentDetails?.email}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.email && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-3 mt-4 pt-2">
                                            <Button
                                                type="button"
                                                className="btn btn-sm btn right btn_primary w-50"
                                                onClick={() => handleSendOTPtoEmail()}
                                                // disabled={otpLoading?.email}
                                                // style={{ cursor: otpLoading?.email ? "not-allowed" : "pointer" }}

                                                icon={<IoMdSend className="button_icons" />}
                                            >
                                                {fetcher.state === "submitting" ? "sending...OTP!" : fetcher.state === "loading" ? "Loading.." : "send OTP"}
                                                {/* send OTP */}
                                            </Button>
                                        </div>
                                    </div>

                                    <label
                                        className="form-label fs-s text_color"
                                        htmlFor="remail"
                                    >
                                        Enter OTP<span className="text-danger">*</span>
                                    </label>
                                    <div className="form-group text-start col-lg-6 col-md-6 d-flex">
                                        <div className="otp-input-container">
                                            {Array.from({ length: 6 }).map((_, index) => (
                                                <input
                                                    key={index}
                                                    name={`otp-${index}`}
                                                    type="text"
                                                    className="otp-input form-control"
                                                    disabled={emailVerificationState?.enableOTPInputFeild === false}
                                                    style={{ cursor: emailVerificationState?.enableOTPInputFeild === false ? "not-allowed" : "" }}
                                                    maxLength="1"
                                                    value={emailVerificationState?.emailOTP[index] || ""}
                                                    onChange={(e) => handleInputChangeEmail(e, index)}
                                                    onFocus={() => handleFocus(index)}
                                                    onKeyDown={(e) => handleKeyDownemail(e, index)}
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                />
                                            ))}

                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.emailOTP && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.emailOTP}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className={`btn ${emailVerificationState?.otpVerified === true ? "btn-success" : "btn_primary"}    btn-sm btn right  ms-5 w-100`}
                                                onClick={() => handleVerifyOTP()}
                                                disabled={emailVerificationState?.enableOTPInputFeild === false || emailVerificationState?.otpVerficationOtpVerify === true}
                                                style={{ cursor: emailVerificationState?.enableOTPInputFeild === false ? "not-allowed" : "" }}
                                            >
                                                {fetcher.state === "submitting" ? "Verifing..." : fetcher.state === "loading" ? "Loading.." : emailVerificationState?.otpVerified === true ? "Verified" : "Verify"}

                                            </button>
                                        </div>
                                    </div>
                                    <div></div>
                                    {/* <p className="fs-12 mt-2">{(emailVerificationState?.otpVerified === false && countdown > 0) ? `Expires in ${formatCountdown(countdown)}. You can resend the OTP after the timer ends.` : ""}</p> */}
                                    {/* <p className="fs-12 mt-2"> {`Expires in ${formatCountdown(countdown)}. You can resend the OTP after the timer ends.`}</p> */}

                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="control_prev_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleNext}
                                                    icon={<IoMdArrowForward />}
                                                    disabled={emailVerificationState?.otpVerified === false}
                                                    style={{ cursor: emailVerificationState?.otpVerified === false ? "not-allowed" : "" }}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Student Details Start */}
                            {active === 2 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6 ">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="name"
                                            >
                                                Name<span className="text-danger">*</span>
                                            </label>

                                            <input
                                                className={
                                                    errors && errors.name
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                value={studentDetails?.name}
                                                placeholder="Enter your name"
                                            />
                                            <div className="response lh-1" style={{ height: "12px" }}>
                                                {errors && errors.name && (
                                                    <span className="fs-xs text-danger lh-1">
                                                        {errors.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="email"
                                            >
                                                Email<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.email
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                style={{ cursor: "not-allowed" }}
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                // onChange={(e) => setEmail(e.target.value)}
                                                onChange={(e) => handleInputChange(e)}
                                                value={studentDetails?.email}
                                                placeholder="Enter your email address"
                                                disabled
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.email && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                htmlFor="filename"
                                                className="form-label fs-s text_color"
                                            >
                                                Choose your photo<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.filename
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="filename"
                                                name="filename"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleInputChange(e)}

                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.filename && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.filename}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="birthdate"
                                            >
                                                Date of Birth<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.birthdate
                                                        ? "form-control input_bg_color date_input_color error-input"
                                                        : "form-control input_bg_color date_input_color"
                                                }
                                                id="birthdate"
                                                name="birthdate"
                                                type="date"
                                                max={new Date().toISOString().split("T")[0]}
                                                onChange={(e) => handleInputChange(e)}

                                                value={studentDetails?.birthdate}
                                            // onKeyDown={handleKeyDown}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.birthdate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.birthdate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="mobilenumber"
                                            >
                                                Contact Number<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.mobilenumber
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="mobilenumber"
                                                name="mobilenumber"
                                                type="number"
                                                // onKeyDown={handleKeyDown}
                                                placeholder="Enter Contact Number"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 10);

                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        mobilenumber: "",
                                                    }))
                                                    setStudentDetails((prev) => ({
                                                        ...prev,
                                                        mobilenumber: value,
                                                    }));
                                                }}
                                                value={studentDetails?.mobilenumber}
                                                maxLength={10}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.mobilenumber && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.mobilenumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="whatsappno"
                                            >
                                                Whatsapp Number<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.whatsappno
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="whatsappno"
                                                name="whatsappno"
                                                type="number"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 10);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        whatsappno: "",
                                                    }))
                                                    setStudentDetails((prev) => ({
                                                        ...prev,
                                                        whatsappno: value,
                                                    }));
                                                }}
                                                value={studentDetails?.whatsappno}
                                                // onKeyDown={handleKeyDown}
                                                placeholder="Enter WhatsApp number"
                                                max="10"
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.whatsappno && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.whatsappno}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="gender"
                                            >
                                                Gender<span className="text-danger">*</span>
                                            </label>
                                            <div className="position-relative">
                                                <IoChevronDownSharp className="position-absolute end-0 mt-2 me-2" />
                                                <select
                                                    className={
                                                        errors && errors.gender
                                                            ? "form-control input_bg_color error-input"
                                                            : "form-control input_bg_color text-capitalize"
                                                    }
                                                    aria-label="Default select example"
                                                    id="gender"
                                                    name="gender"
                                                    // onChange={(e) => setGender(e.target.value)}
                                                    onChange={(e) => handleInputChange(e)}
                                                    value={studentDetails?.gender}
                                                    required
                                                >
                                                    <option disabled className="fs-s" value="">
                                                        Select your Gender
                                                    </option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.gender && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.gender}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="maritalstatus"
                                            >
                                                Marital Status<span className="text-danger">*</span>
                                            </label>
                                            <div className="position-relative">
                                                <IoChevronDownSharp className="position-absolute end-0 mt-2 me-2" />
                                                <select
                                                    className={
                                                        errors && errors.maritalstatus
                                                            ? "form-control input_bg_color error-input"
                                                            : "form-control input_bg_color text-capitalize "
                                                    }
                                                    aria-label="Default select example"
                                                    id="maritalstatus"
                                                    name="maritalstatus"
                                                    required
                                                    onChange={(e) => handleInputChange(e)}
                                                    // onChange={(e) => setMaritalStatus(e.target.value)}
                                                    value={studentDetails?.maritalstatus}
                                                >
                                                    <option disabled className="fs-s" value="">
                                                        Your Marital Status
                                                    </option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                </select>
                                            </div>
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.maritalstatus && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.maritalstatus}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="college"
                                            >
                                                College/School/Branch
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.college
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="college"
                                                name="college"
                                                type="text"
                                                required
                                                // onChange={(e) => setCollege(e.target.value)}
                                                value={studentDetails?.college}
                                                // onKeyDown={handleKeyDown}
                                                onChange={(e) => handleInputChange(e)}
                                                placeholder="College/School/Branch"
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.college && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.college}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                htmlFor="aadharCardImage"
                                                className="form-label fs-s text_color"
                                            >
                                                Upload Aadhar Card<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.aadharCardImage
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="aadharCardImage"
                                                name="aadharCardImage"
                                                // ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleInputChange(e)}
                                            // value={studentDetails?.aadharCardImage || ""}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.aadharCardImage && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.aadharCardImage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="zipcode"
                                            >
                                                Aadar card Number<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.aadharCardNumber
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                maxLength={12}
                                                id="aadharCardNumber"
                                                name="aadharCardNumber"
                                                type="number"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 12);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        aadharCardNumber: "",
                                                    }))
                                                    setStudentDetails((prev) => ({
                                                        ...prev,
                                                        aadharCardNumber: value,
                                                    }));
                                                }}
                                                value={studentDetails?.aadharCardNumber}
                                                // onKeyDown={handleKeyDown}
                                                placeholder="Enter your aadhar number"
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.aadharCardNumber && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.aadharCardNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="zipcode"
                                            >
                                                Pincode<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.zipcode
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                maxLength={6}
                                                id="zipcode"
                                                name="zipcode"
                                                type="number"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 6);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        zipcode: "",
                                                    }))
                                                    setStudentDetails((prev) => ({
                                                        ...prev,
                                                        zipcode: value,
                                                    }));
                                                }}
                                                value={studentDetails?.zipcode}
                                                // onKeyDown={handleKeyDown}
                                                placeholder="Enter your pincode"
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.zipcode && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.zipcode}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="country"
                                            >
                                                Country<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.country
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="country"
                                                name="country"
                                                type="text"
                                                required
                                                // onChange={(e) => setCountry(e.target.value)}
                                                onChange={(e) => handleInputChange(e)}
                                                value={studentDetails?.country}
                                                placeholder="Enter your Country"
                                            />

                                            <div className="response" style={{ height: "9px" }}>
                                                {errors && errors.country && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.country}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="rstate"
                                            >
                                                State<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.state
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="state"
                                                name="state"
                                                type="text"
                                                required
                                                // onChange={(e) => setState(e.target.value)}
                                                onChange={(e) => handleInputChange(e)}
                                                value={studentDetails?.state}
                                                placeholder="Enter your State"
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.state && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.state}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="native"
                                            >
                                                Native Place<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.native
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="native"
                                                name="native"
                                                type="text"
                                                required
                                                // onChange={(e) => setNative(e.target.value)}
                                                onChange={(e) => handleInputChange(e)}
                                                value={studentDetails?.native}
                                                placeholder="Enter your Native Place"
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.native && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.native}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="rarea"
                                            >
                                                Area<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.area
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="area"
                                                type="text"
                                                name="area"
                                                required
                                                // onChange={(e) => setArea(e.target.value)}
                                                onChange={(e) => handleInputChange(e)}
                                                value={studentDetails?.area}
                                                placeholder="Enter your Area"
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.area && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.area}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="control_prev_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleSubmitStudentDetails}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Student Details End */}

                            {/* Parent Details start */}
                            {active === 3 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="parentsname"
                                            >
                                                Parent&apos;s/Guardian&apos;s Name
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.parentsname
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="parentsname"
                                                name="parentsname"
                                                type="text"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                // onChange={(e) => setParentsName(e.target.value)}
                                                value={parentsDetails?.parentsname}
                                                placeholder="Enter Parent's/Guardian's Name"
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.parentsname && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.parentsname}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="parentsnumber"
                                            >
                                                Parent&apos;s/Guardian&apos;s Contact
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.parentsnumber
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color text-capitalize"
                                                }
                                                id="parentsnumber"
                                                name="parentsnumber"
                                                type="number"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 10);

                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        parentsnumber: "",
                                                    }))
                                                    setParentsDetails((prev) => ({
                                                        ...prev,
                                                        parentsnumber: value,
                                                    }));
                                                }}
                                                value={parentsDetails?.parentsnumber}
                                                // onKeyDown={handleKeyDown}
                                                placeholder="Enter Parent's/Guardian's contact"
                                                max="10"
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors?.parentsnumber && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.parentsnumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleSubmitParentDetails}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Parent Details end */}

                            {/* Education Details Start */}
                            {active === 4 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="educationtype"
                                            >
                                                Education Type<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={
                                                    errors && errors.educationtype
                                                        ? "form-select select form-control input_bg_color error-input"
                                                        : "form-select select form-control input_bg_color"
                                                }
                                                aria-label="Default select example"
                                                id="educationtype"
                                                name="educationtype"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                // onChange={handleEducationSelectChange}
                                                value={educationDetails?.educationtype}
                                            >
                                                <option disabled className="fs-s" value="">
                                                    ---Select---
                                                </option>
                                                <option value="B.Tech">B.Tech</option>
                                                <option value="MCA">MCA</option>
                                                <option value="SSC">SSC</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div style={{ height: "8px" }}>
                                                {errors && errors?.educationtype && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.educationtype}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="marks"
                                            >
                                                Percentage<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.marks
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                maxLength={2}
                                                id="marks"
                                                name="marks"
                                                type="number"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 2);
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        marks: "",
                                                    }));
                                                    setEducationDetails((prev) => ({
                                                        ...prev,
                                                        marks: value,
                                                    }));
                                                }}
                                                value={educationDetails?.marks}
                                                // onKeyDown={handleKeyDown}
                                                placeholder="Enter your percentage"
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.marks && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.marks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="academicyear"
                                            >
                                                Academic Year<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.academicyear
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                id="academicyear"
                                                name="academicyear"
                                                type="number"
                                                placeholder="Enter your academic year"
                                                required
                                                onChange={(e) => {
                                                    let value = e.target.value.slice(0, 4);
                                                    if (value == "0000" || value.startsWith(0)) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            academicyear: "Enter valid year",
                                                        }));
                                                        return
                                                    }
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        academicyear: "",
                                                    }));
                                                    setEducationDetails((prev) => ({
                                                        ...prev,
                                                        academicyear: value,
                                                    }));
                                                }}
                                                value={educationDetails?.academicyear}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.academicyear && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.academicyear}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleSubmitEducationDetails}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Education Details End */}

                            {/* Admission Details Start */}
                            {active === 5 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="enquirydate"
                                            >
                                                Enquiry Date<span className="text-danger">*</span>
                                            </label>

                                            <input
                                                className={
                                                    errors && errors.enquirydate
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                type="date"
                                                id="enquirydate"
                                                name="enquirydate"
                                                onChange={(e) => handleInputChange(e)}
                                                required
                                                max={new Date().toISOString().split("T")[0]}
                                                value={admissionDetails?.enquirydate}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.enquirydate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.enquirydate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="enquirytakenby"
                                            >
                                                Enquiry taken by<span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={[
                                                    {
                                                        label: admissionDetails.enquirytakenby,
                                                        value: admissionDetails?.enquirytakenbyId,
                                                    },
                                                ]}
                                                classNamePrefix="select"
                                                value={[
                                                    {
                                                        label: admissionDetails.enquirytakenby,
                                                        value: admissionDetails?.enquirytakenbyId,
                                                    },
                                                ]}
                                                onChange={(selectedOption) =>
                                                    handleInputChange(selectedOption, "enquirytakenby")
                                                }
                                                isDisabled
                                                styles={{ cursor: "not-allowed" }}
                                            />

                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.enquirytakenby && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.enquirytakenby}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="coursepackageId"
                                            >
                                                Course Package<span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                // className="fs-s bg-form text_color input_bg_color"

                                                className={
                                                    errors && errors.enquirytakenby
                                                        ? "fs-s bg-form text_color input_bg_color error-input"
                                                        : "fs-s bg-form text_color input_bg_color"
                                                }
                                                options={coursePackageListData}
                                                classNamePrefix="select"
                                                value={
                                                    coursePackageListData.find(
                                                        (option) =>
                                                            option.value === admissionDetails.coursepackageId
                                                    ) || null
                                                }
                                                onChange={(selectedOption) =>
                                                    handleInputChange(selectedOption, "coursepackage")
                                                }
                                            />

                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.coursepackage && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.coursepackage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="coursesId"
                                            >
                                                Course<span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={coursesList}
                                                classNamePrefix="select"
                                                value={
                                                    coursesList?.find(
                                                        (option) =>
                                                            option.value === admissionDetails?.coursesId
                                                    ) || [
                                                        {
                                                            label: admissionDetails.courses,
                                                            value: admissionDetails.coursesId,
                                                        },
                                                    ]
                                                }
                                                onChange={(selectedOption) =>
                                                    handleInputChange(selectedOption, "courses")
                                                }
                                            />

                                            <div style={{ height: "8px" }}>
                                                {errors && errors?.courses && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.courses}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="leadsourceId"
                                            >
                                                Lead Source<span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={leadSourceList}
                                                classNamePrefix="select"
                                                value={
                                                    leadSourceList.find(
                                                        (option) =>
                                                            option.value === admissionDetails.leadsourceId
                                                    ) || null
                                                }
                                                onChange={(selectedOption) =>
                                                    handleInputChange(selectedOption, "leadsource")
                                                }
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.leadsource && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.leadsource}
                                                    </p>
                                                )}
                                            </div>

                                            {(admissionDetails.leadsourceId === 7 ||
                                                admissionDetails.leadsourceId === 8 ||
                                                admissionDetails.leadsourceId === 13) && (
                                                    <div className="mt-3">
                                                        <label
                                                            htmlFor=""
                                                            className="form-label fs-s text_color"
                                                        >
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control input_bg_color"
                                                            required
                                                            onChange={(e) =>
                                                                setAdmissionDetails((prev) => ({
                                                                    ...prev,
                                                                    leadsource: prev.leadsource?.length
                                                                        ? prev.leadsource.map((item, index) =>
                                                                            index === 0
                                                                                ? { ...item, name: e.target.value }
                                                                                : item
                                                                        )
                                                                        : [{ name: e.target.value }],
                                                                }))
                                                            }
                                                            value={admissionDetails?.leadsource[0]?.name || ""}
                                                        />
                                                        <label
                                                            htmlFor=""
                                                            className="form-label fs-s text_color"
                                                        >
                                                            Mobile Number
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control input_bg_color"
                                                            required
                                                            onChange={(e) => {
                                                                let value = e.target.value.slice(0, 10);
                                                                setAdmissionDetails((prev) => ({
                                                                    ...prev,
                                                                    leadsource: prev.leadsource?.length
                                                                        ? prev.leadsource.map((item, index) =>
                                                                            index === 0
                                                                                ? { ...item, mobileNumber: value }
                                                                                : item
                                                                        )
                                                                        : [{ mobileNumber: value }],
                                                                }));
                                                            }}
                                                            value={
                                                                admissionDetails?.leadsource[0]?.mobileNumber ||
                                                                ""
                                                            }
                                                        />
                                                    </div>
                                                )}
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="branch"
                                            >
                                                Branch<span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={BranchsList}
                                                classNamePrefix="select"
                                                value={
                                                    BranchsList.find(
                                                        (option) =>
                                                            option.value === admissionDetails.branchId
                                                    ) || null
                                                }
                                                onChange={(selectedOption) =>
                                                    handleInputChange(selectedOption, "branch")
                                                }
                                                // isDisabled
                                                styles={{ cursor: "not-allowed" }}
                                            />

                                            <div style={{ height: "8px" }}>
                                                {errors && errors?.branch && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.branch}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="modeoftraining"
                                            >
                                                Mode Of Training<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={
                                                    errors && errors.modeoftraining
                                                        ? "form-select select form-control input_bg_color error-input"
                                                        : "form-select select form-control input_bg_color"
                                                }
                                                aria-label="Default select example"
                                                id="modeoftraining"
                                                name="modeoftraining"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                value={admissionDetails?.modeoftraining}
                                            >
                                                <option disabled className="fs-s" value="">
                                                    --Select--
                                                </option>
                                                <option value="Online">Online</option>
                                                <option value="Offline">Offline</option>
                                                <option value="hybrid">Hybrid</option>
                                                <option value="self-learning">Self Learning</option>
                                            </select>
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.modeoftraining && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.modeoftraining}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="admissiondate"
                                            >
                                                Admission Date<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.admissiondate
                                                        ? "form-control input_bg_color error-input date_input_color"
                                                        : "form-control input_bg_color date_input_color"
                                                }
                                                id="admissiondate"
                                                type="date"
                                                name="admissiondate"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                value={admissionDetails?.admissiondate}
                                                max={new Date().toISOString().split("T")[0]}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.admissiondate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.admissiondate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="validitystartdate"
                                            >
                                                Validity Start Date
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.validitystartdate
                                                        ? "form-control input_bg_color error-input date_input_color"
                                                        : "form-control input_bg_color date_input_color"
                                                }
                                                id="validitystartdate"
                                                type="date"
                                                name="validitystartdate"
                                                onChange={(e) => handleInputChange(e)}
                                                value={admissionDetails?.validitystartdate}
                                                required
                                                max={new Date().toISOString().split("T")[0]}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors?.validitystartdate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.validitystartdate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="validityenddate"
                                            >
                                                Validity End Date<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.validityenddate
                                                        ? "form-control input_bg_color error-input date_input_color"
                                                        : "form-control input_bg_color date_input_color"
                                                }
                                                id="validityenddate"
                                                type="date"
                                                name="validityenddate"
                                                onChange={(e) => handleInputChange(e)}
                                                value={admissionDetails?.validityenddate}
                                                required
                                                min={new Date().toISOString().split("T")[0]}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors?.validityenddate && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.validityenddate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleSubmitAdmissionDetails}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Admission Details End */}

                            {/* Fee Details Start */}
                            {active === 6 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="feetype"
                                            >
                                                Fee Type<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={
                                                    errors && errors.feetype
                                                        ? "form-select select form-control input_bg_color error-input"
                                                        : "form-select select form-control input_bg_color"
                                                }
                                                aria-label="Default select example"
                                                name="feetype"
                                                id="feetype"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                value={feeData.feetype}
                                            >
                                                <option disabled className="fs-s" value="">
                                                    --Select--
                                                </option>
                                                <option value="Admission Fee">Admission Fee</option>
                                                <option value="fee">Course Fee</option>
                                            </select>
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.feetype && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.feetype}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="amount"
                                            >
                                                Amount<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.amount
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color"
                                                }
                                                id="amount"
                                                type="number"
                                                name="amount"
                                                placeholder="Enter Fee Amount"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                value={feeData?.amount}
                                                disabled
                                                style={{ cursor: "not-allowed" }}
                                            />

                                            <div style={{ height: "8px" }}>
                                                {errors && errors?.amount && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.amount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="discount"
                                            >
                                                Discount
                                            </label>
                                            <input
                                                className={"form-control input_bg_color"}
                                                id="discount"
                                                type="number"
                                                name="discount"
                                                onChange={(e) => handleInputChange(e)}
                                                placeholder="Enter the Discount"
                                                required
                                                value={feeData?.discount}
                                            />
                                        </div>

                                        <div className="col-lg-3 form-group text-start align-middle mt-4 pt-2">
                                            <Button
                                                onClick={handleFeeDetails}
                                                className="btn btn_primary fs-13"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                    {feeAndBillingDetails?.feedetails.length > 0 && (
                                        <div className="row mt-3">
                                            <div className="col-xl-12 ">
                                                <div className="table-responsive ">
                                                    <table className="table table-hover align-midle table-nowrap mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh-xs black_color text_color"
                                                                >
                                                                    Fee Type
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh-xs black_color fw-600 text_color"
                                                                >
                                                                    Amount
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh-xs black_color fw-600 text_color"
                                                                >
                                                                    Discount
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh-xs black_color fw-600 text_color"
                                                                >
                                                                    Tax Amount
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh-xs black_color fw-600 text_color"
                                                                >
                                                                    Total Amount
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="fs-13 lh-xs black_color fw-600 text_color"
                                                                >
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {feeAndBillingDetails?.feedetails.length > 0 &&
                                                                feeAndBillingDetails?.feedetails.map((item) => (
                                                                    <tr key={item?.id}>
                                                                        <td className="fw-medium fs-13 text_color">
                                                                            {item?.feetype == "fee" ? "Course Fee" : item?.feetype}
                                                                        </td>
                                                                        <td className="fs-13 text_color">
                                                                            {item?.amount}
                                                                        </td>
                                                                        <td className="fs-13 text_color">
                                                                            {item?.discount}
                                                                        </td>
                                                                        <td className="fs-13 text_color">
                                                                            {parseFloat(item?.taxamount?.toFixed(2))}
                                                                        </td>
                                                                        <td className="fs-13 text_color">
                                                                            {item?.totalamount}
                                                                        </td>
                                                                        <td
                                                                            onClick={() => handleFeeDelete(item?.id)}
                                                                        >
                                                                            <MdDelete className="text_danger" />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleFeecalculations}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Fee Details End */}

                            {/* Billing Start */}
                            {active === 7 && (
                                <>
                                    <div className="row">
                                        <div className="col-xl-12 ">
                                            <div className="table-responsive ">
                                                <table className="table table-hover align-midle table-nowrap mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Gross Total
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Total Discount
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Total Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="fs-13  text_color">
                                                                {feeAndBillingDetails?.grosstotal}
                                                            </td>
                                                            <td className="fs-13  text_color">
                                                                {feeAndBillingDetails?.totaldiscount}
                                                            </td>
                                                            <td className="fs-13  text_color">
                                                                {feeAndBillingDetails?.finaltotal}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-xl-12 ">
                                            <div className="table-responsive mt-2 ">
                                                <table className="table table-hover align-midle table-nowrap mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Fee Type
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Fee (Excl. of GST)
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Tax
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="fs-13 lh-xs black_color fw-600 text_color"
                                                            >
                                                                Fee (Incl. of GST)
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {feeAndBillingDetails?.feedetailsbilling?.length >
                                                            0 &&
                                                            feeAndBillingDetails?.feedetailsbilling?.map(
                                                                (item) => {
                                                                    if (item.feetype !== "Material Fee") {
                                                                        return (
                                                                            <tr key={item?.id}>
                                                                                <td className=" fs-13 text_color">
                                                                                    {item?.feetype}
                                                                                </td>
                                                                                <td className=" fs-13 text_color">
                                                                                    {parseFloat(
                                                                                        item?.feewithouttax.toFixed(2)
                                                                                    )}
                                                                                </td>
                                                                                <td className=" fs-13 text_color">
                                                                                    {parseFloat(item?.feetax.toFixed(2))}
                                                                                </td>
                                                                                <td className=" fs-13 text_color">
                                                                                    {parseFloat(
                                                                                        item?.feewithtax.toFixed(2)
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                }
                                                            )}

                                                        {feeAndBillingDetails?.feedetailsbilling?.length >
                                                            0 && (
                                                                <tr>
                                                                    <td className="fw-medium fs-13 text_color">
                                                                        <b>Sub Total</b>
                                                                    </td>
                                                                    <td className=" fs-13 text_color">
                                                                        {parseFloat(feeAndBillingDetails?.totalfeewithouttax.toFixed(2)
                                                                        )}
                                                                    </td>
                                                                    <td className=" fs-13 text_color">
                                                                        {parseFloat(
                                                                            feeAndBillingDetails?.totaltax.toFixed(2)
                                                                        )}
                                                                    </td>
                                                                    <td className=" fs-13 text_color">
                                                                        {parseFloat(
                                                                            feeAndBillingDetails?.grandtotal.toFixed(2)
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )}

                                                        <tr>
                                                            <td rowSpan={3} />
                                                            <td rowSpan={3} />
                                                            <td className="fs-13 text_color">Material Fee</td>
                                                            <td className="fs-13 text_color">
                                                                {feeAndBillingDetails?.materialfee}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="fw-medium fs-13 text_color">
                                                                <strong> Grand Total</strong>
                                                            </td>
                                                            <td className="fs-13 text_color">
                                                                {feeAndBillingDetails?.finaltotal}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleNext}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Billing End */}

                            {/* Others Start */}
                            {active === 8 && (
                                <>
                                    <div className="row">
                                        <div className="form-group text-start col-lg-3 col-md-6 ">
                                            <label
                                                className="form-label fs-s text_color"
                                                htmlFor="admissionremarks"
                                            >
                                                Remarks<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className={
                                                    errors && errors.admissionremarks
                                                        ? "form-control input_bg_color error-input date_input_color"
                                                        : "form-control input_bg_color date_input_color"
                                                }


                                                id="admissionremarks"
                                                type="text"
                                                name="admissionremarks"
                                                placeholder="Enter your Remarks"
                                                required
                                                onChange={(e) => handleInputChange(e)}
                                                value={feeAndBillingDetails?.admissionremarks}
                                            />
                                            <div style={{ height: "25px" }}>
                                                {errors && errors?.admissionremarks && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors?.admissionremarks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group text-start col-lg-3 col-md-6">
                                            <label className="form-check-label fs-s text_color" htmlFor="cardtableCheck">
                                                Assets
                                            </label>

                                            <div className="w-100 ">
                                                <div className="form-check ">
                                                    <label className="form-check-label fs-s text_color" htmlFor="bag">
                                                        Bag
                                                    </label>
                                                    <input
                                                        className="form-check-input input_bg_color text_color"
                                                        type="checkbox"
                                                        id="bag"
                                                        name="bag"
                                                        checked={feeAndBillingDetails?.assets?.includes("bag")}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div className="form-check ">
                                                    <label className="form-check-label fs-s text_color" htmlFor="laptop">
                                                        Laptop
                                                    </label>
                                                    <input
                                                        className="form-check-input input_bg_color text_color"
                                                        type="checkbox"
                                                        id="laptop"
                                                        name="laptop"
                                                        checked={feeAndBillingDetails?.assets?.includes("laptop")}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div className="form-check ">
                                                    <label className="form-check-label fs-s text_color" htmlFor="lms">
                                                        LMS
                                                    </label>
                                                    <input
                                                        className="form-check-input input_bg_color text_color"
                                                        type="checkbox"
                                                        id="lms"
                                                        name="lms"
                                                        checked={feeAndBillingDetails?.assets?.includes("lms")}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div className="form-check ">
                                                    <label className="form-check-label fs-s text_color" htmlFor="courseMaterial">
                                                        Course Material
                                                    </label>
                                                    <input
                                                        className="form-check-input input_bg_color text_color"
                                                        type="checkbox"
                                                        id="courseMaterial"
                                                        name="courseMaterial"
                                                        checked={feeAndBillingDetails?.assets?.includes("courseMaterial")}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                {shouldShowMacAndTshirt && (
                                                    <div className="form-check ">
                                                        <label className="form-check-label fs-s text_color" htmlFor="mac">
                                                            Mac
                                                        </label>
                                                        <input
                                                            className="form-check-input input_bg_color text_color"
                                                            type="checkbox"
                                                            id="mac"
                                                            name="mac"
                                                            checked={feeAndBillingDetails?.assets?.includes("mac")}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                )}

                                                {/* --- Conditional T-shirt Size Dropdown --- */}
                                                {shouldShowMacAndTshirt && (
                                                    <div className="form-group mt-3">
                                                        {" "}
                                                        <label className="form-check-label fs-s text_color" htmlFor="tshirtSize">
                                                            T-shirt Size
                                                        </label>
                                                        <select
                                                            className="form-select input_bg_color text_color"
                                                            id="tshirtSize"
                                                            name="tshirtSize"
                                                            value={feeAndBillingDetails?.tshirtSize || ""} // Controlled component
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="">Select Size</option>
                                                            <option value="xs">XS</option>
                                                            <option value="s">S</option>
                                                            <option value="m">M</option>
                                                            <option value="l">L</option>
                                                            <option value="xl">XL</option>
                                                            <option value="2xl">2XL</option>
                                                            <option value="3xl">3XL</option>
                                                            <option value="4xl">4XL</option>
                                                        </select>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>

                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active !== 9 && (
                                                <Button
                                                    type="button"
                                                    className="btn  right btn_primary "
                                                    onClick={handleSubmitOtherDetails}
                                                    icon={<IoMdArrowForward />}
                                                >
                                                    Continue
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Others End */}

                            {/* Preview Starts */}
                            {active === 9 && (
                                <>
                                    <div className="">
                                        <div className="card p-2">
                                            <div className="">
                                                <div className="row">
                                                    <div className="col-4 d-flex justify-content-start h-155 mt-2">
                                                        <img
                                                            className="col-lg-4 col-md-6  col-sm-4 h-100 object-fit-cover"
                                                            style={{ border: "4px solid  #b3b9d0" }}
                                                            src={studentDetails?.imagePerview}
                                                            alt="user_img"
                                                            width={"50%"}
                                                        />
                                                    </div>
                                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody className="fs-13 ">
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className=" ps-0 black_300 fw-500   fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Name
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                                                        <span className="ms-4">: </span>
                                                                        {studentDetails?.name}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className=" ps-0 black_300 fw-500   fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Email
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                                                        <span className="ms-4">: </span>
                                                                        {studentDetails?.email}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className=" ps-0 black_300 fw-500   fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Date Of Birth
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                                                        <span className="ms-4">: </span>
                                                                        {studentDetails?.birthdate}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className=" ps-0 black_300 fw-500   fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Contact
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                                                        <span className="ms-4">: </span>{" "}
                                                                        {studentDetails?.mobilenumber}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className=" ps-0 black_300 fw-500   fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Aadhar Number
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2  fw-500 ">
                                                                        <span className="ms-4">: </span>{" "}
                                                                        {studentDetails?.aadharCardNumber}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-6  col-sm-12 ">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Pincode
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.zipcode}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Country
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.country}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        State
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.state}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Native Place
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.native}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Area
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.area}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-6">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        WhatsApp Number
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {studentDetails?.whatsappno}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Gender
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.gender}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Marital Status
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {studentDetails?.maritalstatus}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-6  col-sm-12 ">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Parent&apos;s Name
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {parentsDetails?.parentsname}
                                                                    </td>
                                                                </tr>

                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Parent&apos;s Number
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {parentsDetails?.parentsnumber}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Academic Year
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {educationDetails?.academicyear}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                            {/* <p className="text_color">
                          <b className="prev_bold">Relation:</b> Other
                        </p> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-6  col-sm-12">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Lead Source
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-4">: </span>
                                                                        {admissionDetails?.leadsource[0]?.source}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Branch
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-4">: </span>{" "}
                                                                        {admissionDetails?.branch}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Mode Of Training
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-4">: </span>{" "}
                                                                        {admissionDetails?.modeoftraining}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Admission Date
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-4">: </span>{" "}
                                                                        {admissionDetails?.admissiondate}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4 col-md-6  col-sm-4">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Validity Start Date
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {admissionDetails?.validitystartdate}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Validity End Date
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {admissionDetails?.validityenddate}
                                                                    </td>
                                                                </tr>

                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Education Type
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {educationDetails?.educationtype}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Percentage
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {educationDetails?.marks}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6  col-sm-12">
                                                        <div className="table-responsive table-scroll">
                                                            <tbody>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Enquiry Date
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {admissionDetails?.enquirydate}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Enquiry taken by
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {admissionDetails?.enquirytakenby}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Course Package
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>{" "}
                                                                        {admissionDetails?.coursepackage}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13"
                                                                        scope="row"
                                                                    >
                                                                        Course
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {admissionDetails?.courses}
                                                                    </td>
                                                                </tr>
                                                                <tr className="lh-400">
                                                                    <td
                                                                        className="ps-0 black_300 fw-500 text-start  fs-13 text-truncate"
                                                                        style={{ maxWidth: "120px" }}
                                                                        title="College/School/Branch"
                                                                        scope="row"
                                                                    >
                                                                        College/School/Branch
                                                                    </td>
                                                                    <td className="text-mute text-truncate fs-14 ps-2 text-start fw-500 ">
                                                                        <span className="ms-5">: </span>
                                                                        {studentDetails?.college}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12 ">
                                                        <div className="table-responsive mt-2 ">
                                                            <table className="table table-hover align-midle table-nowrap mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh-xs black_color fw-600 text_color"
                                                                        >
                                                                            Fee Type
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh-xs black_color fw-600 text_color"
                                                                        >
                                                                            Amount
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh-xs black_color fw-600 text_color"
                                                                        >
                                                                            Discount
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh-xs black_color fw-600 text_color"
                                                                        >
                                                                            Tax Amount (Inclusive of GST)
                                                                        </th>
                                                                        <th
                                                                            scope="col"
                                                                            className="fs-13 lh-xs black_color fw-600 text_color"
                                                                        >
                                                                            Total Amount
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {feeAndBillingDetails?.feedetails &&
                                                                        feeAndBillingDetails?.feedetails?.map(
                                                                            (item, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="fs-13 text_color">
                                                                                        {item?.feetype}
                                                                                    </td>
                                                                                    <td className="fs-13 text_color">
                                                                                        {item?.amount}
                                                                                    </td>
                                                                                    <td className="fs-13 text_color">
                                                                                        {item?.discount}
                                                                                    </td>
                                                                                    <td className="fs-13 text_color">
                                                                                        {parseFloat(
                                                                                            item?.taxamount
                                                                                        ).toFixed(2)}
                                                                                    </td>
                                                                                    <td className="fs-13 text_color">
                                                                                        {item.feetype === "fee" ? (
                                                                                            <>
                                                                                                Materialfee:{" "}
                                                                                                {
                                                                                                    feeAndBillingDetails?.materialfee
                                                                                                }
                                                                                                &nbsp;, CourseFee:{" "}
                                                                                                {item.totalamount -
                                                                                                    feeAndBillingDetails?.materialfee}
                                                                                                <br />
                                                                                                <b>{item.totalamount}</b>
                                                                                            </>
                                                                                        ) : (
                                                                                            <b>{item.totalamount}</b>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12 col-md-6 ">
                                                        {feeAndBillingDetails?.admissionremarks && (
                                                            <p className="text_color">
                                                                <b className="prev_bold"> Remarks:</b>{" "}
                                                                {feeAndBillingDetails?.admissionremarks}
                                                            </p>
                                                        )}
                                                        {feeAndBillingDetails?.assets?.length > 0 && (
                                                            <p className="text_color">
                                                                <b className="prev_bold">Assets:</b>{" "}
                                                                {feeAndBillingDetails?.assets?.map(
                                                                    (item, index) => (
                                                                        <span key={index}>
                                                                            {index ===
                                                                                feeAndBillingDetails?.assets.length - 1
                                                                                ? item
                                                                                : item + ", "}{" "}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="controls d-flex justify-content-between  mt-4">
                                        <div>
                                            {active !== 1 && (
                                                <Button
                                                    type="button"
                                                    className="btn control_prev_btn reg_btn text_color"
                                                    onClick={handlePrev}
                                                    icon={<IoMdArrowBack className="button_icons" />}
                                                >
                                                    Go Back
                                                </Button>
                                            )}
                                        </div>

                                        <div>
                                            {active === 9 && (
                                                <Button
                                                    type="submit"
                                                    className="btn  right btn_primary "
                                                    onClick={() => handleSubmitSubmitEnrollement()}
                                                    icon={<IoMdCheckmark />}
                                                    disabled={fetcher.state === "submitting" || fetcher.state === "loading"}
                                                    style={{ cursor: (fetcher.state === "submitting" || fetcher.state === "loading") ? "not-allowed" : "pointer" }}
                                                >
                                                    {/* Submit */}
                                                    {fetcher.state === "submitting" ? "Submitting...!" : fetcher.state === "loading" ? "Loading.." : "Submit"}



                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* Preview ENd */}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRegistrationFrom;



// {
//     "name": "Test",
//     "email": "krishnaprasad.c@teksacademy.com",
//     "mobilenumber": "0846683202",
//     "parentsname": "Sadasd",
//     "parentsnumber": "4554353453",
//     "birthdate": "2025-03-04",
//     "gender": "Male",
//     "maritalstatus": "Single",
//     "college": "InfoZIT",
//     "country": "India",
//     "state": "Andhra Pradesh",
//     "area": "Krishna",
//     "native": "Vijayawada",
//     "zipcode": "521229",
//     "whatsappno": "0846683202",
//     "educationtype": "B.Tech",
//     "marks": "54",
//     "academicyear": "2025",
//     "filename": "Student_id_card_Krishna Chintapalli.png",
//     "imgData": "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CIiAiIgIUQoPzyREXfOMEREBERAREQEREBERAREQFuD0Y/5oLd/fz/6jlp8twejH/NBbv7+f/UcqnjP3ePP5rLhX20+XyWYiIuXdCIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAhRCg/PJERd84wREQEREBERAREQEREBERAW4PRj/mgt39/P8A6jlp8twejH/NBbv7+f8A1HKp4z93jz+ay4V9tPl8lmIiLl3QiIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIUQoPzyREXfOMEREBERAREQEREBERAREQFuD0Y/5oLd/fz/6jlp8twejH/NBbv7+f/UcqnjP3ePP5rLhX20+XyWYiIuXdCIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAhRCg/PJERd84wREQEREBERAREQEREBEXIBcQACSeQAQcLcHox/zQW7+/n/1HKnNN9C8gyB0Nbfy+zW1xDi1zf9okb5g0/R387vuK2ZxHHbZi1hgslojfHSQbloe8ucSTuST5yVQ8Wy7VdHo6Z3O1zwzGuUV+kqjUaesiIufXQiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICFEQfnki2H1J6Po3kuGFVGw23db6h3f8A1H/9j9/cqEvNruNmuMtuulHNR1UR2fFK3Yj8x6122Pl2siN0T83J3sa5ZnVcMNERbDwEREBERAREQERWho3pJcc1lZc7iX0NjY7nLt5dQR+iz1ed3+a8716izTz1zqHpatVXauWmOqI4Nhl/zK5/IrJRmQNI62Z/kxRDzud/27VtLpjpFjmGsirJWC53duxNVM0bRu//ANbf0fb2+tTXHLHasdtMVrs1FFSUsXYxg7T3uJ7yfOV6K5jM4lcv+rT0p/na6DFwKLPrVdZERFWN8REQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFHs3wzHsxoPkt7oWSuaNop2jhli/su7fs7FIUWVFdVE81M6ljVTFUaqjo061V0jvuFySVtOH3Kzb7tqmM8qMeaRo7Pb2H1dirdfoXIxksbo5GNex4LXNcNwQe0ELX7WbQ5jmTX3CoGsc3d89uHYR3mL1/1fu8y6HC4tFeqL3b4/NSZfDZp9e12eDXVF9SMfHI6ORpa9pIc0jYg+ZfKu1SIiICIrJ0J05lze/mpro3NslE4Gpfvt1ru6Nvt7z3D2hed27Taomurshnbt1XKopp7ZezoPpK/KZGX/II3xWaN28MR5GqI/wAmevvW09NBDTU8dPTxMihiaGRsYNmtaOQAHcEpoIaanjp6eJkUMTQxjGN2a1o5AAdwXYuPy8uvJr5quzuh0+NjU2KdR2iIi1WyIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIKZ130ihyKGfIscgjhvDBxzwNGzaoDtPqf6+/v861bmikhmfDMx0cjHFrmuGxaR2gr9ClQXSW0zZUQTZpYaXaeMcVxhjH02/8A3QPOP0tu7n5yr3hnEJiYs3J6d0/sp+IYUTE3aI697W9ERdCpHoY7aKy/Xyjs9AzjqauURsHcN+8+odpW8WDY1QYljFHY7e0GOBnlybbGV5+k8+sn8lRfRHxVs1bcMuqmbin/ANlpAR+mQC932DYD+0fMtj1zXGMma7noo7I/Vf8ADMflo9JPbP6CIiploIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAuJGMkjdHI0OY4EOaRuCD3LlEGmmu+DuwvM5G00e1rr956RwHJvPyo/a0/uIVercnpC4uMk04rXwxh1ZbQayHlzIaN3tHtbv9oC02XX8NyZv2Y32x0lzGdY9Dd6dkt19DLQ2z6WWSDg4XzwCpf6zJ5QP3EKbLEstIKCzUVCBsKenjiA/stA/7LLXKXa+euavGXSW6eSiKfAREXmzEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQcSNa9jmOG7XAgj1LSXI8Ir6TIblS08REMNXLHGD3NDyB+4LdtQq5YXFVXGpqjG0maV0h+0kqwwMv6PNXtaWbjeniPYmqIir26IiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAuCuVwUHKIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLgrlcFByiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAuCuVwUHKIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLgrlcFByiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAuCuVwUHKIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLgrlcFByiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiAiIgIiICIiAiIgIiICIiAiIgIiHkCUBFUmkmo10vtyynwjqKOGhtBLmyMj4OFgc7cuO/PkE06znLc+zOrntcVPQ4lRycPWPg4pZvM0OJ7T2nlyG3eturDuUzVv8AD2/m1qcqiqKdd620UZqM+xCmvdXZam+U8FdRsL6iOVrmNjaACSXkcPeO9V5rJX2bJaXF7rQ5++y0U00nUObBNtUEOaCQGt3BB5eVy5rC1jV11RFUTET36llcv000zMTEzHthdKLxslyWw4rbmVWQXaGjiPktdISXyEduzRu532BY+I5tiuWdYMfvMFa+Pm+PZzJAPPwPAdt69tl5eir5efU68e56eko5uXfXwSFFSFjzmtotd8nob9kDoLDRQSOZHPIBFGQY9tvXzOw9asnE8+xDKql9LYb5BV1DBuYi18byPOGvAJHrG69ruLct9dbjUTvzedvIor6b1O9JMijt1zfFbVkLbBcbzDS3F0fW9VK1wAZsXbl+3CBsD2lYuPakYRf7r812nIaaes3IbGWvj4z5mlwAd9hK8/Q3Nc3LOvJn6WjeuaNpYiwb7eLXY7dJcLvXwUVLH9KSV+w9g859Q5qM0Oqun9bRVVZT5LTuipWh03FFI14BO24YWhzh7AVFNq5XG6aZmPJNVyimdTMQmiLAsF4tt+tMN1tNSKmjnBMcoa5vFsduxwBUR1f1HpcEoqeGGlNfd63cUtMN9tuzidtz23OwA5lKLNddfo6Y6oru0UUc8z0T1FRM+Qa/UtC7IJ7HbDRtZ1r6ERt42s2334Q7j7O7ff1KX4lqLFmWnd3udJE+33OippOui33Mb+AkOae8cv3L3rw66Y5omJj2TvTyoyqKp1MTE+2FjoqP0X1QoaTBJ6/O8o3qHVzo4jNvJIWhrexrAXbbk89tlbeOZBZcltvy+xXOCtpzyL4jzYfM5p5tPqICwv41yzVMVR0jv7mdm/RdiJies93e9VFUGiVPTU2W5PPHm776Q89bTmKVvU+WeZ4xsTyI8lStuqunxtkty8JaYU0UnVOJikDi7bfYMLeJ32AqbmNXTXNNETPZ3T3ooyKZp5qpiPzhNEXi43leO5HbZLjZLrBW08QJkLNw5n9ppAcPtCqaxa7Uk2otfRXSvt8OMMa/5JVspZesed28O/aeflfojsUW8W7c5tU9naV5NujW57V5ovIyHJrDj9rbc7zdKeipXgFjpCd37jfZrR5Tjt3AbrwotVdP5bRJdWZLTmlikbG89VIHtcd9t2cPFsdjz22XnTZuVRummZjyZ1XaKZ1NUJoijt6zjFrLaaC63O7Np6K4AGllMMjusBG45BpI5EdoC8+5apYBbrk23VeTUjKh23JrXva3fuc5rS1p8+5G3eppsXauymfcTetx21R70yRdMVVSy0bayKphfTOZxiZrwWFvn4uzb1qKUmqOAVV5FogyejdVl/A0bPEbneYSEcB+wrGm3XVvliZ0mq5RTrc62mKKLUWZ2DIbXevB26iqnt0D+uLY3sMbuF230gN+bT2b9irHSjLMkuejWV3avvFVUV1IZOone7d0e0YI2+1e1GLXVTMz01MR19ryqyaImIjrvfwXuiobH7rccl6O9fWX7LKigmNUWuuEgc8taHt2aeAcWx325Kz9JIWQaeWlkV6deo+qJbWOa5vWDiPYHeVsOwb+ZTexptUzMz1idfyS1f8ASTERHbG/5CVIiLVbAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiAiIgIiICIiAiIgIiICIiAiIgLh30T7Fyh5ghBpHUU1+mhyuS3da+1xVodco4j5RZ1juEn+qD/2W1uj9fjddgNuOLtZFRRM6t8O4445B9IP/AK2/Pfv3BXhaUab12KXXIai61VFWU92cdo4w47NLnEh3EB3FYuHaaX3C8/qrnjl0ohjtW/eagnLw8NPmIBG7TvsfNyPnVzmZFrIpmiJ1rrHhPT9VVi2LliYqmN76T7Ov6K9qcYt2WdJu7Wu7B76IEyyxseW9Zwsbs0kcwN/Ms/pIWa24/S4RabTT/J6OCpmEcfG53Du6M9riT3qwLNp5c6HWe4ZxJXUjqKpY5rYG8XWDdrRz5bd3nXOtOn1yzmosUlvraSmFule+QT8XlBxZ2bA/0SlOXT6e3ur1Yj46knGq9FX6vrTPw3COa7YbkNyzK05Ta7XDf6SiiDJbbI/bfZxJ2B7Qd+7ny7CvJ09q8IrtVKSaWxXnDsjY3hZQ+SynlPCdwWlgdzHs3U61S06uGRXmjyPG74+0XqkAaC4kxSAdm+3YRue47rysV0xyWXPabMM4yKnuVVRt2p4qaPhG4323OwAA3J2A5rG3ft/R9VVdkTHfE+XhPmyrs1+m3TT3xPdrz8YQqz45asl6T2Q0l5pm1VLB1k/Uu+i9wDAOLzjyt9vUudW7Da8N1cxKuxykjtxqJWF8cPkt3Dw07Du3B2KsjGdPrlatY7zm01bSPo6+N7I4WcXWN4uDt3G36J7186raeXPLsrsF3oq6kp4rY8OlZNxcT/LDuWwPm71lTl0+mp3V6vLr2djGcar0VXq+tzb+KvtSrNRZB0nrVabiwyUk0ERlYDtxhrHu4fYdtk6SmJ2HGKWx3nHrdDbKkVXATTjgB2HEDsO8EdqsO7afXKs1soM6ZW0jaKmiDHQHi60kMc3ly2/SHeu7W7BLjnlot9FbqylpX01QZXGfi2I222GwKi3l003LXrerEdfimvGmaLnq9Znp8Fba1SS5NqXhGNXOofDbKqnp5JdnbcTpHEOPt2AA9q9zXnTrDrVpvUXK1WqnttVRFnVyRbgyAkAtd/S+3mpPqjphHmVgtjIa1tFeLZE1kFTsS12wG7Ttz23G4Pcofc9IdQ8gtD6LJM5jq2QtHyWHieWF/nedt+Q9R+xZWr9Grcxc5Yp7Y69eqLlmvdcTRzc3ZKc9Hv8Amjsn9h//AFlV5qi6On6SmN1F12FEWw9WX/RB3cP+pW7pjjtTiuE2+xVk8M89M1wc+LfhO7ieW4B71i6oYBac8tLKatc6mrINzS1cY3dET3Ed7T3j/JatvIooya6p7J3G/PvbFdmurHppjtjXwS2RzGRufI5rWAEuLjsAPWondrljVwxG/wDg/X2ircyhl675DNG8t8h23FwHl39qraTSrVOoovmao1DY61EcDhxyFxZ5ttufs3+1WDi2nltxfBK7HbQ8unrIHtmqpu2SRzSNzt2Ab8h3DzrCbdm1G4r3O+792UXLtydTRqPb+yrujJhOM33E7hc71aqe4TmqMDevbxBjQ0HkO4nftXZoZTssWt2WY9QlzaCNsgbGTuAGvHD9wOysjRPCa/BMXqLVcKumqpZap0wdBxcIBa0bcwOfJYGH6eXOy6r3zL566kkpLiJBHCzi6xvE4Eb7jbu862ruVTXXeiatxMdGvbx5pptTFPWJ6oR0df8AjHPf7Tv+t68zow4dj2QU98uN7tsNwfDOyGJk7eJjAQSTt5zy+5WRpbp1c8TvuSXCsrqOeO7EmJsXFuzdzj5W4Hn7lkaH4DccCt10pbjW0lU6sqGysMHFs0AbbHcBZX8qjV3kq6zy6/LtRZx6t2+ens5v9K7wK3UuN9JS6WC1sMVtngka6DfdvCWB23sBWBguM4/V9IzILJU2ejltsEcxipXRgxsILNth6tz96s2j08ucGtc+dOrqQ0UkZaIBxdaN2cPm2/evGzLSfI5c/qcuw7JYrVUVbf5YSBwIJAB2LQdwdgeYWUZVFVUxz63REb9rGceuIj1d6qmdexF89oafKekjbsZvJItVPExscPFwtcBGX8I9pGy7ekxgmLWLEaS8WW309tqRVNgcyEcLZWlrjzHnG3aprqrpZPldTQXy03YW3IKNjWmcg8Mu3YdxzBB3581FMg0azzJrYDkWaw11bC4CmjeX9Sxv6RJ4d+I8u77VNnIt7t1ek1FMamOv86ou2K9XKeTcz1iXja6jfR3ARvtvBHz838i1T8aT4K7TbqnW2Ezmg675x3/lePg4uPi82/d2bKHdJG2SWrTrDbPUSMkkpS2ne9m+zi2MAkb+xZtRpTqFUWWOy2/PAcflibwwTl4e1hG5YdhzA38+x9SnmibNExc5esz39eqOXV2rdHN0j9Fe23I7wzo+XS1tnlNMy6sp2v37InN4nM9m4/eriwXSrBq7TSgbU2uCeeso2yyVu/8AKh7hvu13dt5uzkvcoNK7BT6ZyYQ90j4pf5SWqAAkM3/3B5tthy8w2UHtGkeodHS/MAz4Q4+5xa9kPHx9We0Bp5Dfzb7e1Y3Mm3diqKK+T1t9/X3MqMeu3Mc9PN015PF6M0bYbXnsTZOsayBrQ/8ApANm5r50V/mDzX2y/wCkFPdJNL7lhVHklLU3CkqG3SMR05jLt2AB4HFuB/SHZ61xgGmN2x3TbIMXqrhRTVNz4+qlj4uBm7A3nuN+7uS9k2qqq5irtmn4dpasXIpoiY7Iq+Ku7J/9J12/xn/5WK49B/5osd/w7v8Arco3b9LLvTaLVuDOuNCa2on61s44+rA42u58t/0fMp1pxYajGMItdhq5opp6OIse+LfhceInlvz714Zd+3XbqimfxTP5ae2NarorpmY/Dr89pCiIqtYCIiAiIgIiICIiAiIgIiICIiAiIgLgrlcFByiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgh2qGA0WeUdDTVtfUUYo5jK0wtB4iRtsd1LaWEU9LFA0kiNgYCe/YbLsRZzcqqpiiZ6QwiimKpqiOsiIiwZiIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgLgrlcFByiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiDxbnluLWytfRXLI7TR1Ue3HDPVsY9u43G4J3HIhehbLjb7nTiot1dTVkJ/8AMglD2/eFqbmsGnVR0scpZqY6nFoFFCYuvllY3reqi25xkHs39S9Lo/fM9P0iL/4tpKo4KyhLpiTIYRJwt7C/n9Li2357b9ynSNtqkWt1DqRqpqVcrrWYDcscx2xW2pdBA+4cLpaxw57Hi32G2x3AG2/aV7WHa9Pk06ym6ZRbYIb/AIw8RVVPTO/kp3uJawtO52Bc0g8z500bXuvA1Ay20YPitXkl8M4oqbhDhDHxvcXEAADcc9z3kKi7DmHSHrsXk1EFJj8tjkp3VEdp6vhl6kAnjYduLfbmOJx38y67XqdlF/6K+QZfd3W+suUFV1LRLRsdEW8bBsYyOE9pTRtsJit8t+TY5QX+1SPfRV0LZoXPYWu4T5wewr01rvnOrWR43pvp5BZ2WmiuOSUcRkr6qIMpaTdrNyGjZo5u358gB2KT6a3jV9t8qrJk4tV+t8tG6WhyCg4BE2Xh3ax4bsCPY3zdu6aNrXo7lbqypmpqSupqieA7TRxytc6M9mzgDy+1ZS030AptT36z5ULVcbRHUR3JvhAZWbiVvXHj6ryeR+lt2dymHjN1jveqmXYXh9Jba35DUuZBNURsYyjia7bcnlxOPIDff2Jo22YRUDqBqTqJcdQoNMNOoaCO909IyW53GqaHMifwBzg0EFoA3HPY7k7ALyptSNYMf1Zw/BsujtMXy6cCeqpIg5lbE5wAI3HkOBDgdtu0ck0bbE/OVu+cfm35fTfLeHi+T9a3rNvPw77qLV+peMUWptJp7PJVC81UPWxkQ7xDkSGl2/aQCezb1rWzJabUx/S2rIrJcLRHkDoHuo5ZmbxNpeE8LXDh+lw+rtVp3DJ7zTdKDG8Zq4bY9sto46mf5IwzcfVuLuGTbiDeJvYmja80Wu51D1W1Mye80WlJtFqstnnMDq+tYHvqXgnkAQ4AHbfs5Dv7l72lGquR3o5VimYW+mt+W49TySPMA/kpWtHJwBJ7y08jsQQeSaNrqRavadZv0gdRMKqbrj9TYKZtHUvY6pngaJKktAPVtbsWgAd+25J7QrT6OmpFbqPiVXUXiiipLvbKo0lY2IERudtuHAHfbvBG55hNG1gXK82i2VFPTXG50dHNVO4YI55msdKdwNmgnn2js867rlX0Vto31txq4KSmj+nNNIGMb3cyeQWtXTTs9VkGZae2ShmbDVV080EMjiQGvc6INPL17LFybPqjKujHlNhv/FDlNg6qluUMnJ79pWhsvr32IPrHrCaNtoaKqpq2kjq6OoiqKeVvFHLE8Oa8ecEciF3LXhupdVp/oBgNLZaCO45BeaaOmt9PJvwcXIFztiNxu5o23HasW+5zrjpd8iyDUJlkvOPVVQ2GqbRsDZKQu7AC0N8x5niHLbcbhNG2yKxLtdLbaKT5Xda+loafiDetqJRGzc9g3PLdQeSDUW4apWm+Wm+2/wAApaNr5aQsaZJC5hII8nfmS0g8Q5dyleXYxYcttBtGR22K4UJkbL1MjnAcTd9jyIPeVCWJ4e4R6X2L9vi/Ne/T1EFRTMqqeaOWCRoeyRjgWuaeYIPeFqjp9prg1x6TGcYxW47TTWe308b6WlL38MRLY9yCHb/pHtPerp1zyCk050UuT7XG2mcylFvt0TSfIc8cDdt+fkjc/Yp0jacWe+2S8PmZabvQ174NutbTztkLN/PseXYV2V12tdBWU1HW3Gkpqmrdw08UszWvmPLk0E7k8x2edal6F2u46S6tYrTXSZ/yPMrS0uLuQbO47hh9YPD/AOtTHpX3ejsGq2l97uJkbSUVXLPMWM4nBrXxE7AdpTRtsNdblb7VRurLnXU1FTNIDpZ5AxgJ7OZ5Lz8hyvG8fsLb7eb1RUdte0OZUPkHDICNxw7fS3HYBvuta+kfrbgua6WVtgsc9xfWyzRPaJqN0bdmu3PMqw6HSygz3HNNbzeLlI6gs1ppnG2OhD4qhxjYSXHf1Adh7E0bWFg2oeFZuZW4tkNJcZIRvJE0OZI0efgeA7b17bLGvWqendmulRa7rl9qo62mfwTQSzbOY7zEKlbbb7XXdMel8BKOCmorPRuF4ko2BsPFwuaWnh5E7uaNvOPUVFauSNvSH1Bphpm3O6yeoBpqeWFro4A0DieXOBDd9wPWeSaNtqsSzDGMtinlxq90d0ZTkNmdTv4gwnsBXh5Jq5pvjl5+Z7xl1vpq4O4XxDik6s+Z5YCGf8xCgWjuc4zU4vl9PZcJp8Nv9nppJa63xQtj3c1jtjyAJ2I25hR3ow6b4jlekNZkGTWWku1yvFVUmSoqWB8kYBLRwO7WncE7jnuU0bbGU9zt1Ram3aCvppLe6PrRUtlBiLNt+Li7NvWofZtYdM7xfhY7dmFunr3P4GM8prXu8zXuAa4+wndUr0frDV55oplunEt8qaCmorwYI6hjONwhJDjHsSORLT3966Okvh+J45hGJ4LjFspZMrlqomUjqeINqXgDZ0jyOY4nEdvfv5k0bbI5jluN4fbRccmvFLbKYnha6Vx3efM1o3Lj6gCsbCM7xHNqeWfFr7S3NsX+8bHu17PNuxwDgPWQonkWkdJlGaY5k+TXR1dFZqJkLrbLAHwyyAHikJJ7zsez9EKttNKO31/S6vdxwmlip7DbaJ0FfJStDYHykBvCNuRJcN+X9AlNC4q/VvTSgrp6GszS0QVNPI6KaJ82zmPadiD6wQvSoc9w2uxurySkyOgmtFG7hqaxkm8cR5ciftH3rU/EZGt1B1BpotJI88rzep5WmaBpZTRiR+/lOadiT2AduyvTQ684Hn2CXizUWFUNkZDN1V1szqdoj6zuJaAN+be8bgtSYNrFxLL8Yy2KeXGr3R3RlOQ2V1O/iDCewFZeQ32zY9bzcL7dKO2UgcGGaqmbGziPYNz3rXroSCCl8OmgMhghuIA7msaOP7gAo9q7X1msrMsvdNJNFheH0M/yRzTsK2sDT5frA7fZt/STXU22ZuGZYrb8bhySsv8AQRWacgRVplBifv2bOHI9hXgeObSv06sv468jQux2bIej5ilvvtro7lSGja8wVUQkZxBztjseW6rHWXDMMvWreK6Y4ti9pt0jpBXXmoo6Rkb2U47GcTRuNwCftamhfmYagYbiFDT1uR5BR0ENS0Og4iXPlae9rGguI59oCy8Oy3G8wthuWM3imudMDwudETuw+ZzTsWn1EBQu46RWCr1Qfnt+rI66lgoxT09uqoGmCma1oAduTty5nmO9V50Y6WmrdatQMhxWAU2IOIp4BE3hhll4gQWDs2ADzy7A8edBskiIoSIiICIiAiIgIiICIiAiIgIiICIiAiIgLgrlcFByiIgIiINd/AGTIelDmUuQY1VTWGttDYYqyejd1BeYom+RIRw8Q8rsO42KyejXbcnwy65HplfrHcha4ppJbddfkTxBK1w5t63bhO4II58jxBX+inaNNNrZgztObneLLlejNwzeGSodNbLlQU75d2HkGPLd+HsHI8+Z7eSndg0ru+RaK5JSVGG2PD7tdwx1JSUjJGPLYzxMExe92xJJG2w27/MNjl5uU2eO/wCO11mlqqmkbVwui6+mkLJYiexzSOwg802aa54xnWqVs02dp9JpbeY7vRUT6JlxlicyjZE1hHWOeRwkhvmJB2Uc01ttxu/QwyO32qgqq+slr3COnpoXSyP2fGTs1oJPJTJ2m3SCpLNNiNHqBbKqxytdF8qqGkz9W7fcFxaXjl/WPtVw6Q4NRad4NR41RzuqXRbyT1Bbw9bI7m523cO4DzBTshVWU0eYUOjWDUrdO6HKrXT26nZeLZV0cjq6AhjRvG3iBDu0HySQe5eLoLjt5i1odecWw/IsNw0Ujm1lFdjI1s0paduBr+f0uE789tj2b7LZ1FGzTWrCqbL9NtfMofUYPe7va8lr2mC4UMDpIYWPlJ43kAhoHEd9yNtvMve0OsN8t2vWpNyuFmuNJQ1k+9LUz0r2RTjrCd2OI2d9hV7omzTXDUG0Zppzr3PqXj2M1mT2i7QiKsp6ONz5ojwgHk0E/ogg7bdoOy8a/wA2oeda5YDlNdgF6s9kpanhhZJTPe+FocC+Schu0e+42DtuTVtQibNNcNUbfluIdI+k1Ht2HXfJbVLQ9Q5lthMsjHcBaQQ0EjuO5Gx869G72e+3DpY41kYsF1ZazZ9pqk0j+qhc6J/kPftwhwJA2J7VfyJs01gxDw30IyTIbSzA7xlVhudU6qoaq1wukc089mv4QduWwO+3Zy3XtaRYhmFffs41Oyyzy2muv1FJBR2wtPWtj4RtxN7QdmNGxAJ58gthUTZpTHRDst4sekM1DerTX2yqNxqHiCsp3wyFpDdjwuAOx86wuiPYr3ZKfNBerPcbYam8mSAVdM+HrWbHym8QHEPWFeiJs0o/X+x3q56vaW11ts9wraSiuRfVz09M+SOnb1kR3e5oIaNgeZ27Cov0udKbtcHOzLCqKtqK2qYKW7UVFE6R1SzcFrwxoJJBAB9gPcVswibNNZst08y2u0f02v1jtczshxSNkz7ZURlkjxu1xbwu2PECwcu3mVj6jXvUXWy1UOD0Wmt7xumlqI5rlXXOF8ccYZ3NLmjfmd/OduztW0KJs0rinyPJLFqLZNPqLC66px6O3sY69+V1cfAzYAnh4f0QNid+asdEUJUXpvYr3SdKjPrzVWe4wWyqpo209ZJTPbBMQ2LcMeRwu7D2HuKwuk3juT6h5zimC2qhuVPaOJ1VXXVtG99NA7mBu/YNLgGnlv2uC2BRTtGmqes2jGolFjdLkFPnN5zCvs08clHRNoSZGeUPKjDXOO42adgOwKS6o0GQZbnOjt9OL3Z0bJetubHUEhFIS6LiEoLfIHJ30tuQWw6Js0p3pU4xJctHa+lx7Hn1le6ohLIqGi6yUgPG+wYCdtlENVr1qlZ9J8SxPCsVvT5qmywNuFZTUUr5abaNrTFsB5Du3ffmPV2rZFE2aa19Hu8XnEjbsVptG8nt7K2douF4rIn7uce2R5MYAA7hvy/epJleSapYFqPc60YhVZhi9cAaM2ujZ8pp3dvC/q2lzgOY3d3bHffdXgibNKD0Pw3J7vl+aZ9mNlksXhJEaeCgl/3jIyNt3DtB2AHPYk78gojh9fq7o7a7lgdFpxXZHSvqZZLZcKYPdEwP7C7gaRtvz2cWnt9q2qRNmlA6f2HM9ItB7ncKSwyXnMLlWGqkooWOl6t79mjcM3Lg0DcgefbdVpplcc7xzJ63Mcn0izLJsoqnHhrZqaRjIGeaNnVnY+vzcgBz33JRNmmuPSLyzVa6WW22HEsMv9PTXKgjqLlUUtJLJLGX78VPuG+SR39/MdnfmdHq+XSwvtuF0mj2R2G3ykmpulbG/wAp4aSXyExgbkjbuA35LYJE2aULcMt1X0/zK+Q3DBq3MLNWTGS2VVoomh7G7khsgiYSe0Al3PluN91n9GjD8mtMmV5fldv+a6/JKx1S2hJ8qJpc53Mdx3d2Hny5q60TZprN0ecEyGpxjUmw3aju2OG8VDooKqoo3xnhdxgvYHcPEOfce9YGW9HvJ8Y01u8Ni1Dvtyghp3uZZqagcG1RPazhbISd/YVtQibNKe6MmMXzDNLG1d9rrvUSVFOJ22uopXtkoQwO3iYwkuJPm2B9S8/o341farJsq1My611luul4qjDSUtZA6KWGnae9rgCN/JH/AC+tXiibNNZelFd9Ub3kDsPsOJZDJi8fAaupttJI99aCAS0PDSA0dm3Pn279imWgOSXKOWmw2LSS94haKamc9tVVsfwueNuTnOYN3O3J337ldCJs0IiKEiIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiCOSZ5g0cjo5Mzxxj2ktc110hBBHaCOJceH+B+m2Ne9YPiXdJhWGyPc9+JWFz3ElznW6EknznyV8+BGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiTw/wP02xr3rB8S7PAjC/RDH/dsPwp4EYX6IY/7th+FB1+H+B+m2Ne9YPiTw/wAD9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/3bD8KeBGF+iGP+7YfhQdfh/gfptjXvWD4k8P8D9Nsa96wfEuzwIwv0Qx/wB2w/CngRhfohj/ALth+FB1+H+B+m2Ne9YPiXt2yvobpQx11traatpJd+rnp5WyRv2JB2c0kHYgj7F5HgRhfohj/u2H4V7NvoqK3UcdFb6Sno6aPfghgjEbG7nc7NHIcyT9qDvREQFwVyuCg5REQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBcFcrgoOUREBERARQHVjVrE9OBBBeJZ6q41I4oKGkZxyuH9IjfZo35bnt7t1FcG6RmHZBfaey3SguWOVdU/gpzXsAie49g4v0SfWNvWp0bXQi4c5rWlznANHMknkvmGWKZvFDKyRvZu1wIUD7RfIkjdIYxI0vHa0HmPsTrI+s6vrGcfbw78/uQfSL466Hyv5WPyPpeUPJ9qSzQwtDpZY4wewucACg+0RpDgC0gg9hC6+vg67qeuj6z+hxDi+5B2IuqoqqanMbaiohhMjuGMPeG8R8w37Su1ARU5qB0hsPxi/T2KgorlkNwpncNQ2gjBjjd3tLu8jv2H2r39J9YMS1FlmobY+oobrTt45aCsZwS8Pe5vc4Dv25jvCnRtYiL4mmihaHTSsjB5AucAvribwcfEOHbffflsoHKLrE8JaHCaMh3YeIbFQvTvU6w5ver3arZFUwzWecQTGfhAkdu4eRsTuPJKCcIq8wrJ86rM2yeiynHqK2WC3HegrGSbulbv3+UeLcc9wBt2KL6War5pqFPkF0tOMW+Ow0UM8dvMlSBNU1LQCxrt3eS0gjc7bDftU6NrrRQ3R69Zff8OZcM2stPZ7oZnt6iA+SWA8nbFziD28t+7dS5k8D5DGyaNz29rQ4Ej7FA7EXD3sjYXvc1rR2knYBfAqIC1rhPHwu+ieMbH2IOxFCcg1LsVl1KtGB1UVS64XWMyRSt4eqYAHHZx33B8g93eFj5xkWd2/PcZtmNY7R3Kw1z9rlWSS7OgHFzLfKG2zefYd+wIJ8i+JZY4mccsjI2+dztgvpjmvaHMcHNPYQdwUHKLqNRThheZ4gwHYu4xsCuxpDmhzSCD2EIOUUE1j1MtemVqt9fdLfWVza6oNPGym24g7h371FMc6RWJXC/UlnvFovmPTVjxHBLcKbhic49m57tzy3228+ynRtcyL462Lj4OsZxbb7cQ32865D2GPrA9vBtvxb8lA+kXxDNFM0uhlZIBy3a4FJZYoW8csjI2+dzgAg+0Xx10XE1vWs4nDdo4hufYnXQ8Tm9azdg3cOIcvag+0XxJLFHH1kkjGM/pOcAPvTrofJ/lY/L+j5Q8r2edB9ovgyxBzmGVnE0buHENwEjlikZxxyMe3+k1wIQfaL4ililBMUjJADseFwOy+0BERARU5mmvtnxvN7jiYxe+3StoOHrTRRB42LQd9hz28oBS/S/UGnzm2Vle2yXOyspZRGW3GPqy/cb7jfuTRtNEXy57Gs4y9oZtvxE8lXeuWpcmnFltVyp7ZHcxX1opuEzcAaCN+IEA7oLGRVzeNSpqDWmw6ei1MkjutAas1ZmIMZ2k8nh25/Q8/ep1e7pQWS0Vd3ulSyloqSJ008r+xjQNyf/AOEGYioX/wCJ/FhK2qkxjJI7G+Xq23Q038kT7P8Atvv6lP8AULVTGcNxC2ZTUOmuFuucsbKZ1Js4uD2lzXbEjlsFOjadouumniqIWyxPa5rgDyO6NqKdwcWzxODPpEPHk+3zKB2IuGua5oe1wc09hB5L4inhlJEU0chb2hrgdkHYirlmpUrteJNM/mpnVsoBV/LOuPESWg8PDt6/OrDE0Rk6sSsL/wCjxDf7kH2iIgIiICIiAuCuVwUHKIiAiIg1r0lgp710s88rcgYye42/dlvZMN+rjDg0FoPZs3h5/wBb1q787w7D8tgpmZZa6StZTv4oHTPLCw+pwIP2bqEat6PVGR5RBm2G5A/GsqhYGOqGtJjqGgbAP25g7ct9juORCjMGh2bZZf6Gs1Zzpl6t1C8SRUFGwtbIf6x2aAD37AkjluFKGFrTJccy1ux3SClu9ZaLAKFtTVvpZNpJxs47cR332a0Ab78ySd14uVY1LoJqZhtZiV9ulRZ75WfI6y31kweD5TASNgB2P37NwR281aWsekk2VXK0ZLiN4GO5NZ2CKlqA3+TfEOxjgOY23O3I8iQQvDxbR3L7nn1vy/VTLqe/S2o8VBSU0XDE1++4ceTQNiAdgOZA3PJTsefppPK7phZ1C6Z5jFuBawuOw5w9gXFVNL/8b1LCJX9V8zE8HEeHfqz3L1tSNIMqqNTfGDp1lNPZLrPF1VWypjLmP5AbjkQQQBuCO7ddOn+jmX2XWSDUHI8spb3M6leyqPVuY8yObw7MaBwhg5bdnsCCtcCwOv1F1g1FoanKbnbLRRXqSSaCldznf1snADvyDRse49qz9dLRUU+r1XcNRbVlNzwYUccdvltTndVTODWguftyB3Djz233HaFcWkenNzw3N81v1dX0dRBkFcamnjh4uKNvG92ztwBv5Q7N15edac6hjO6rK9PM6bbjXxhlVQXEOmp2nYDijaQ4DfYHbYbHfnz2TZpXdry04X0bckuuH5xPkUYqmU9C6piLJ7b1jg0tcHHtAO4PZv2KvBaLHLg0d3t0OqMmcuiFQy4iildBJL28AI58Hmdvv38xyV/4BoTSW3AcksGV3Jt0rMkl62tlp4+rZE4HdpjHnDvK32Hm22XgRaQazR2eDEGap00ONQODY3xQObVNiB3A3AB+zj2TaNJBj+FxavadYXes/Zd6K8Wpxkcxh6h0j2u2PWNc3fyuBp5bHnyKsrUOqraHAb/WW3i+WQW2eSDh7Q8RuII9e6iObYJmM9vxW3YXmlRaae0yj5a+oe6SSqYOHm48+I8ncjyPErLc0OYWPAcCNiCORUJUV0J7fao9JjdadkT7lV1kvy2cgGQkHk0nt2257etWbNhWFuzePK3WukjyFo8mpbIWSHltzaCAeXnCqu46I5jjGRVty0kzdlhoq95knt1UwuiY7+rycCPNuAR5yva0o0YqrFl8uc5zkL8lyd4LYpOEiKnG227d+ZO3IcgAN+XekiizfLZqNqFk1y1Ahza40NLVvp7dQ2One+KBrSQC4t7HbAH1ncnzKW6NXLJaOx6iYzPFkj8bgtU9TaKi8Ur4pWDhI4N3DbfY9g/okjZTi+6Q5rYs1uuR6UZfSWOO8uMldRVkHWRiQncuZ5LhzJJ7ARuea93BtMb7ZsJyGhv2WVN8vt8gljknmkeYIS5pADGnfYbncnYezkp2jSqui3plPlGH2zL73lV2dTxGrpqO3xPAjYxwfG9xJ38olziPNsO3sXj9F7TeyXLU/JameuurH4zdIzRiOdoEvC9+3W+T5X0R2bd62I0Iwqu0+02ocXuVXTVdTTyzPdLT8XAQ+QuG3EAewqFY7pFmOJas12SYrllFBYLrXNqbjQzwEyvZxFzmA7Ed52O4PNNp0heAWmLKNTtZ7DcausZSTtIJhl4Xs2kJ8kkEDs8y8zoo4jbm6V5VmraquFwbBXUIiEo6jgELXcXDtvxbnt3VwafaY3XHNQ84ySquFFNT5ED8njj4uOLck+VuNu/u3XGjWl92wjSi9YhX3Giqaq4SVL45oOLq29ZEGDfcA8iPMmzSirTmN7xvof0j7VWzQ1tzvMlF8pDzxxsO7jse0HZu32qxD0cJLdbrbdsQze70OUROZLUVlTOXwznbd3kgbjn2bk8u3ftXt47oU3xEP04yS4wSVHyl9TBWUrSRDITu1wDtiduYI8xXjQaP6vXSK3WLJ9UGnHaF7eVAHR1MjG8g0vAB7OW5cdvWmx5OsLb9qBrtj2lVwvk9utjaBtRXmieWCeTgLnkA/wBnYb77bqLa1adt01yrCKax5HeKmz1dybw0dZU8ZikDmbluwHIgjlt3K4tYtGqvJbvZsnw2+mxZFaI2wxTScTmyRtGzd3Dcgjnz57g7FRK+aGak5Pe7JkGV55QXO42+ra90XVOZDHE0g7MDWjdxI5nYd3akSItrPp5Zrn0q7BaJ625sgyKM1FW6OdofG4NkG0Z4fJHkDt37SpVqvb249rZo3YqGpqnUtK4QNMsm7nta9oBcRsCfsUx1r0qv2V5dY8yxDIaezX60sMbH1EZcxzSTz5A8/KcNiCDuvrJ9M8myDNtPcnr7zb5KjHA11xPC5pqX7guMYDdhvse3ZNitqOz1Guet+WW3Jr3c6WwY8/qaego5hGHeUW7ncEc+EknbfmOYXoaTG6aa9Iur0tgvVbdcfq6P5TTsq5ON0B4eIc+wHkQdgAeXJSfNtHsop9QqrOdMMrhsNwuDdq+nqYuOKR3e4ciOfbsR28we5eno7pJX4zlFfm2ZX/wgymtb1fXNaWxws7w3fmSdgOwAAbAIKZ6PmmFJqXbMnmyPIL7HQ011kigpKSq4GCQjcyO3B3O3CAPUrD6JFXd6G6Zzg9wuc9xpceuLYaSWZxLg0ukaRz7B5AO3duVMtANOrnpzaL1RXOupKx9wuT6uN1PxbNaQBseIDnyXOk2ndyw7Oc3v9bXUlRBkNaKmnjh4uKJodIdnbgDfyx2b9iiZNID04ZZIcfw6aKF00kd7Dmxt7XkMJAHt7F5WoFBqbrVPj9oqNPJsWttDWCpmr62oaXgAbEBuwd2eYHc7ditHX3Ti56iUePQ2yvo6Q2u5NrJTUcXltA22HCDz9qsyMcLGtPcAE2aaq6hYzdMr6V0uKUOR1tmp5bHEKmenceMxNYOJrRvyLjsN/b7Fnal2q41momD6D2/IblQ2OO3CWrqmPAnqA3jOxI5b7M2827t9jsrRj06ubekNLqSa6k+b32z5GKbyuu4tgN+zbbl510626VVOa3G15Ljl7Niyi08qWr4SWvZuTwu25jmTz59pG3NTs0qTN8afoBnmJXfEL7dZ7VdawUtdb62cSB43bxEbADmD5twR29y7rlZ6rWrpE5FjV/vlxo8fx+PaOkpJeDj2IG/MEbkkknYnsCmWOaOZjeM6t2U6rZfT375pcH0NFSxFkQkBBDncmjkQDsBz2G5Xh6g4nBV68zV+mmoVHYM1ki/263VUT+GXyQeJp4S1242Jbz7N0QjceJ1GB9KnD8egyC5XO2GHraRtZPxyQsIk3YSNgRuCRy718Mwy4ahdJXPsf8JbjaLYwCWrFK7y5WjgDWDfkBudz7Oxddvsd5tnSyxWnvuTeEt+MJmuU0bQGQHhftG0DsAbse7t7AruwTTi54/rPlucVNfRy0d7iayGCPi6yMgtPlbjb9HuKCpsmsVXqb0g5dM7hfrhRY3jdsj3ip5A18/CyMb9hHES8cyDsAvKyzCpdPOkDp7ZrfkV1r7PPWMkp4K2o43weWA5u4ABaeW3JWpqzo9fbxn1Nn+AZJHYcgYwRVHWtJjlaBsDyB7uRBBB5eZeDT6H55Waj45nGT5tR3evoKlstW0xuYxrGu3DIgG7efffbmU2aRy9Yk/O+lvlWP1V9utttjaCKWpbQz9W+Voih2ZuQQBuQTy7l5B0+uWP69R6SWXNL9S4zeaMVdQBOOuEbQ9xYHbbAksI3AHI8wVelg06udu19v8AqJLXUb6C5UTKaOnbxdaxzWxjc8ttvIPf3rm56d3Oq6Qds1IZXUjbfR211G+mPF1rnESDccttvLHf3JtOlTQ4xLo30i8PtGNXy6VNnyIOZU01bMH89yD2AA8y0g7b9vNbMXyW4Q2WtmtNPHU3BkD3UsMjtmySBp4Wk9wJ2Cr/AFE06ueS6s4XmNLXUkNJYHudPDJxdZJuQfJ2G33kKzFEik/CnpF/VxjPvD//AKK4rRJWy2qkluUDIK18LHVETDu1khaOJoPeAd1lIoS1SN2zO0dK/OJ8JxmnyCtfSRtmgmqWwhke0R4tyRvz2G3rUw6R1yyWs6MNXX5Ha22O8PqoOupYKgSCP+XAGzwee42P2qY4npzc7Prpk2oE9fRyUN3pGwRU7OLrWEdXzduNtvIPYe9SfU7EKLO8HuWL18joY6xg4JWjcxPaQ5rtu/YgclO0aQfU2V7eilWzNkcH+D0BDw7nvws57qnNWHvk6Melj5HOe41EJJcdyeRUtm0R1cuOES4ZdtSqKSyQwhlJTshdvJwkcDZH8PEGDYHbyuwD1qQ5jovfL3pDhuGQXa3RVdhkjfPM/j6uQNB34dhv394Uwh5eX/8A1kYN/wDoR/ynVx6mYzHmOCXfGZao0gr6cxibbfgduC0kd43A3Cid703ulfrtjuoEdfRsobXbjSS07uLrXu2k5jltt5Y7T3Kc5hYaTJ8YuFgrpJo6euhMTpIXcL2b9jmnzg7FQlrb8r1D0nwNuOZ3gloy7B6QhvyqmeCWMLtxxtO+/Ps3aPW5ef0qLbit70mw3N8bbUUtHJJHR0lKzZkMcLhI8jg25PDm7b77dqk79EtW342/BXalUEmJvfs4PpSZzHxb7cxv9nHsp1qFozQX/Ry36f2ivdQ/NTo5KKombx7vYCCX7bfS4nb7dm6naNK81qoJNIdGrfjGGXW5sdkN0bHLV1VQHSxtczdwa5oGwOwHs3Xn6m6GU+DaRXTI7DmN/bcoaQPuAmqB1FY1xAe3hABHbuNyezb1qyLjpRkeYaTTYnqHklNcLtFUCa33Clh26gtbs3cbN4u1wPqPaojcdFdXchxKXGMm1Mpai2QQ7UsEcbv5V7foCV/CHFo5H9I8vtTYi2W5LfotCdK8RtVznoDkQZDVVUbyJODj4eHft23dufYp9F0farF73ar1p3mVxt1ZTyB1a24TGWOqHLfcNA7eYIPn7l6t70QbfNGcdw+surKW+WGNpo7jTtJY2QHc8jsS08vMQQD6j5lr0n1SvV+tc2oOpHyq1W1we2mtnFC+o2/Re4BvI7Dcnc7b9m+6bSrvWjN5NPuk7dsjjpPlVUyxMigZt5AlfGA1zv6oPNWx0a8Dkt1pdnmQ3T55yK/N+UOnEvHHBG7nws25bnvI9QHZzybxpC+863V2ZXSS31VhrLV8gloXhxkd5Abv2bbct99913aKaeZbpzc7jaTfaO5YhLI6ShppC/5RSkncActiD3jf1+dJnod61kRFikREQEREBcFcrgoOUREBERARRi+ag4RY7nLbLvlFsoa2HbrIJpw17dwCNx7CCvXsN8s1+pDV2S60dxgB2L6aZsgafMdjyPqKD0ERYl3udvtFBJX3StgoqSPbjmmeGMbvyG5KDLReLe8psVoxOXKquuY60RRCY1MIMjSw9hHDvv29yycYvduySwUd9tMxmoa2MSwSFhaXNPfseYQeiiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICgOpukOEahVMdbfrfKyviaGNq6WXq5eEdgJ7Dt6wp8iCA6Y6Q4Tp5Uy1lhoZX10reB9XVSmSXh7wD2AewKfIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiDUbMajT6m6WWVSakR0klpNDCIxURue3reqi25N577brjR+ldcNXs0q9Hn1Ntxp1scymnMbupFSGNLNmv7uPfkeexKsG0YVW1nSvye+XnGXVNint0baepqqQPgfII4h5JcCNxs4fYVelLTU1JCIaWnigjHYyNga0fYFltGlJ6Nav1Fdo9kF8y+Zrr1jT5m17eEML9gTHyHYSd2+0Ktc+r9Sso6LkmU32805grK3rpqZ0IYfku4bG1mze3j57kjlsvN1pw26x9IOpwnHatsVDmpp6irijO/VtDyXlw7ti1zvWCthdZsHqLzofX4djNO0zRUsbKODiDePqyCG7nluQO/vRCoKGgzWk6JV8nyW70Fbaqi0U7rRDA0h9PHvzD/JG55t7z2FYeHy650OhtqyjH7xZaGyWuh44beYuKaohYTu9xLSNzzO245KQ23w5vnRqvuFXHArrbK+126GlpA9ji6uPFzLG7dwaN9ie1TzEbJd6bovQWGe21MV1FhlgNI6MiUSFrtm8PbvzHJEo1eNeaim0Ds2Z09tiff7xMaGnpufVidpIc/z8PLcDzkBeDkt96QunlihznIrpZLxauKN1dboo9nU7HkADfhb3kDcE7HzjmsCh0kyq+9GaxW6Ogmt+TWS4y11PR1berMnlnyDv2EjYjfly9a780vusep+Kxaf+LSrsZq3Rx3G41JIhDWOBJHEAANwD2knsCIe5rfqplVE7T2swOeNrMj4XinmjaRKXFnCxxPMfS2Oy87Kcy1m0ryayXHNrtZr5Y7tVNgmhpIuHqCSNw0loO4B3B577dyzdVNP71SX/AEit1jtdbcqKwVEMdVUQxFzY2tfHu9x7hyJXtdLrHL9kePY5DYbRWXKSC6tllbTRF5Yzb6R27AnRK72kOaCOwjdF8xAiJgPIhoX0sUiIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIC4K5XBQcoiICIiAiiMupunkUr4pc0sbHscWuaaxgII7R2r58aOnPptYf21n5oI5h+mNyotaL5qPkNzpq6aqj6m3wxsd/s0fZsSf6oA5ecq01D/Gjpz6bWH9tZ+aeNHTn02sP7az81ImCKH+NHTn02sP7az808aOnPptYf21n5qBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/ABo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8AGjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/wAaOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/ABo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8AGjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/wAaOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/ABo6c+m1h/bWfmnjR059NrD+2s/NBMEUP8aOnPptYf21n5p40dOfTaw/trPzQTBFD/Gjpz6bWH9tZ+aeNHTn02sP7az80EwRQ/xo6c+m1h/bWfmpLZrpbrzbYblaa2Ctopt+qngeHsfsS07EduxBH2IMtERAXBXK4KDlERAREQYZtNrJJNtoyTzJMDfyXHzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/knzRav1ZRfgN/JZqIML5otX6sovwG/ksqCKKCJsUETIo29jWNAA+wL7RAREQFwVyuCg5REQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBcFcrgoOUREBERBTWb66jHtQ7hhdDhF4vlbQsY97qN4O7XMa7fh2JAHEAvZ0s1lsWc32pxx1qulivtMzrJKGvjDSW95aQee247QO1VDdqnNaXpe5XJgtut1fcTb4Q+Otl6tgj6qHcg79u+yzdJn3X/4n7lPqXSfIMvqLf/8A0+Km4TSvhDdjs4EknhafuO+yy0jbZMXK3FkkguFJwRO4ZHdc3Zh8x58ivqurqKgiEtdWU9LG48IdNKGAnzbkrUXRDTan1BznNJrtebhT2+13vrWUlO/hbLNxvIc7fzAbfaV6lmxiDWzX7MocxuNabdj7hBSUUMxYOHjc0beYeSSdu0uCjRttMK2i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6+EL4n6Sd4J/kMZoGf253u/yAWJN0jspc0iOyWiM9x2kO3/7lSSLOOHY0fgYznZE/iW1P0gM9eSYzbYh5hTb/wCZXk1utOo1S8ubfvk/qip2AfvBVdovSMPHjsoj3POcq9PbVPvSmt1FzuseXzZbeQT2iKqdGPuaQFHq2ura6Uy1tZUVMh7XTSl5+8lY6L3pt0U/VjTyqrqq7Z2IiLJiIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAvoL5X0EHyi+ntcx7mPBa5p2IPcV8oCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAvoL5WQykqXNDmwSEEbggdqCda8YZWYpnFZOIH/NtwlfUUsob5PlHdzN+wFpPZ5tlXq3/AL5arberbJQXWihrKV48qOVu49vqPrWnetNgtGPZQ6js9J8mgH6HWOf+9xJVVw7P9NEW6o6wss7D9FM10z0lBERFaq0REQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBEWfj9PDVXimp52ccb3gObuRuPsSZ1GyI3OnOPWe43+8U1ptVM+oq6h4YxjR2es+YDtJ7gturPpTY6S0UdLO50k0NOyOR4aNnODQCezzhetptiWOY5aI5bNaYKWWZg6yUbue7v5ucSdvVupauWzuJVXqtUdIh0WHg02qd19Zl//2Q==",
//     "enquirydate": "2025-03-04",
//     "enquirytakenby": "ERP",
//     "coursepackage": "Employment Program",
//     "coursepackageId": 18,
//     "courses": "Full Stack Development - Python",
//     "coursesId": 247,
//     "leadsource": [
//         {
//             "source": "Nayeem"
//         }
//     ],
//     "branch": "Hitech City",
//     "branchId": 1,
//     "modeoftraining": "Online",
//     "admissiondate": "2025-03-04",
//     "validitystartdate": "2025-03-04",
//     "validityenddate": "2026-01-04",
//     "feedetails": [
//         {
//             "id": 1741062427021,
//             "feetype": "Admission Fee",
//             "amount": 500,
//             "discount": 0,
//             "taxamount": 76.27118644067798,
//             "totalamount": 500
//         },
//         {
//             "id": 1741062429957,
//             "feetype": "fee",
//             "amount": 34220,
//             "discount": 0,
//             "taxamount": 5220,
//             "totalamount": 34220
//         }
//     ],
//     "grosstotal": 34720,
//     "totaldiscount": 0,
//     "totaltax": 3730.271186440678,
//     "grandtotal": 24454,
//     "finaltotal": 34720,
//     "admissionremarks": "Ddffs",
//     "assets": [
//         "bag",
//         "laptop"
//     ],
//     "totalinstallments": 0,
//     "dueamount": 34720,
//     "addfee": false,
//     "initialpayment": [],
//     "duedatetype": "",
//     "installments": [],
//     "materialfee": 10266,
//     "feedetailsbilling": [
//         {
//             "id": 1741062427021,
//             "feetype": "Admission Fee",
//             "feewithtax": 500,
//             "feewithouttax": 423.7288135593221,
//             "feetax": 76.27118644067792
//         },
//         {
//             "id": 1741062429957,
//             "feetype": "Course Fee",
//             "feewithtax": 23954,
//             "feewithouttax": 20300,
//             "feetax": 3654
//         },
//         {
//             "id": 1741062429957,
//             "feetype": "Material Fee",
//             "feewithtax": 10266,
//             "feewithouttax": 10266,
//             "feetax": 0
//         }
//     ],
//     "totalfeewithouttax": 20723.728813559323,
//     "totalpaidamount": 0,
//     "student_status": [],
//     "user_id": 104,
//     "certificate_status": [
//         {
//             "courseStartDate": "",
//             "courseEndDate": "",
//             "certificateStatus": "",
//             "requistedDate": "",
//             "issuedDate": ""
//         }
//     ],
//     "extra_discount": []
// }





// {
//     "name": "krishna prasad chintapalli",
//     "email": "krishnaprasad.c@teksacademy.com",
//     "imageFile": {},
//     "studentImage": "student_id_card_Krishna Chintapalli.png",
//     "imagePerview": "data:image/png;base64,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IFcCBOBcVTeFRQABBBBAAAEEECAA0wYQQAABBBBAAAEEciVAAM5VdVNYBBBAAAEEEEAAAQIwbQABBBBAAAEEEEAgVwIE4FxVN4VFAAEEEEAAAQQQIADTBhBAAAEEEEAAAQRyJUAAzlV1U1gEEEAAAQQQQAABAjBtAAEEEEAAAQQQQCBXAgTgXFU3hUUAAQQQQAABBBAgANMGEEAAAQQQQAABBHIlQADOVXVTWAQQQAABBBBAAAECMG0AAQQQQAABBBBAIFcCBOBcVTeFRQABBBBAAAEEECAA0wYQQAABBBBAAAEEciVAAM5VdVNYBBBAAAEEEEAAAQIwbQABBBBAAAEEEEAgVwIE4CZQ3c8+97ydeMpp9umnn1nvnXawQw8+yGaeeeYmcGZN7xSwanp1whkhgAACCCCQNQECcCPX2IQJ31ufvnvYu+++VziTIw8/zPYesGcjn1nTe3usml6d5PWMvv3uO7v9jrvs7jH32k+TfgoYunSZ07botblts/WWNlvnzrE073/wob333vuJ2Vq3bm2rrLKSde7UqeRrfpw40R54YJw9/Mij9tbb7wT7LbTQgrbeumvbVltuYXN16eJ9v19++cXG3Huf3Xzrf+277yYE+3fs1NE2XH892/Hf29u8885T9hjTpk2zZ559zm665b/26quvBfu2atXKVlqxh+24w3bWvVu34P9Ht4mTJtnzz79oU6dO9Z6j22HJJZewJRZfrLD/K6++Zl999XWd1yexi75I5zFx4iSbPmN64U+dOna0tm3bFv7/77//bs8897z9Nvm3xOesHaPnrX+r1C3VG7MzAgjECmQmAP/008926cjLbdLESSWrcpl/LG1LLLG49ejeregLqynX/fjxb9iu/fa0Sf/7EdW5brftP+2cs86oymlHf2Bmm62zrbLySrE/RlV5wwoOEv1BaT9ze1t91VWsXbt2RUertVUFp17xS6Ltea65utgefXezDh06lDzmG2++Zdff8J/C37utsLzt8O/tKj6Har7wpptvtVdfez31IZOU4cFxDwfhzm1t27axvrvtGoS8ctvnX3xho64abb//PiXYzfde0Trp1LmT7TOgv3Xs+HedKLBce/2Ndu5559uvv/4a+/azzDKLnXzicbbtNltbixYtiva5bOQVdtY5QxI7derU0a4ZdYUtt9yydV4zY8YMu+76G+2sc88reS4KnQMP3N/22au/KRBGNx1DtkccfZz98MMPseflO4acDzv8KHv+hRdLlmvttda0IWefGVwkhLe4z7QPJ9pBcPiRx9itt91e52Xl7OLeQ+H3xJNPsxv+c1PRn0deepFttOEGhX/Txc8OO/cJ7til2aLnXR+3NO/LvgggEC+QmQCc5ktHP0B79ts9+NKPhqim1hAmT55s+x14sD32+BPBqel8hw0dYhtv9PcXbn3OOfoDs8bqq5m+0JvSEIto3SrY3HTDtXV6rmptVR/ntK+Na88H7LePHTLwwDqhyR173EMP24B99i+8VTUvlNKef3T/UiHEd1xfGXRxtN8BA+2Rxx4vOpRCnf5Tbou2fd97+dqhwuLIK0bZOUOGBj135TZ9js8750zbbNNNinarZgC+YtRVdubZQ7znogB7+GGH2IA9+9VpW2Pvu98OPfwok3O5rdQxvvjiS9tjwN723vsf+KraFIIvGja06CKvKQXgUha1CMD1dfNiswMCCHgFmmUAdqWO+8L1ijTCDrr9OPra6+3rb76xLXttHvTQRnuOKj2t5hSAZVBLq0qNK3ldXACeddZZ7YoRlwT1H7flMQCXCki6tX7lyEvL9phXOwBrmNIuu/ez77//q6dUoXDllVa0LTbfLPjsajhEuFdQd6RGj7rC5phj9kJ1VisAaxjFbv362zffflvUVOaccw5r3aq1fTdhQlEwjusNjRtSpHPeZuutgmPeceddhSEV+v9zzzWXjR51eXArX5suCE4+9Qwbfe11hXOYffbZbZuttrDFF1/cHn/iSXtw3EOF85DXSSccZ7vsvGNh/6YSgNUbu3u/AfbRxx/X+ehVKwCfdspJwRyParhV8p3DaxBAoFggswFYPSxd5pyzKCj+/PPPpvFw4U23lY89+siqBcqsNaDmFoCz5l/qfEvd0dDwnctHXBI7hrShArB6N9966+3gs6SgmeRuQdwQiC++/LJwZ0MOGoLQdZllikh8wxIuGH6R6T/RbaaZZgoC8FprrlGySVQ7AEfPZd+997JDDz6wMJwo2qsXd47hAJz2Fn24oNFzWX21VYMhBm6srsbEHnbEUcG4XLft1mcXO/H4YwrfhXfdM8YOHXRkIaD22nxTO/eswYW7Zvo+3f+gQ+yJJ58qHMOFOP3DZ59/bn122yP4b23zzTevXX3lSFt8sb/G58b1mG+4wfpBL7AbUxuto0rmP2joyu9TfjcF+n32O9AUZrUl9VXv98BDB9kDDz4U25aiATjJd1A05C64wAJ27egrTf9dDbck58A+CCBQXiCzATjuVr5+uEdefqUNOX9Y4Us9/MUTR6EfijFjx9qjjz0R9N5o4kePbt1sqy17WfduK8SOm4seR8e45b+3BT/2mkCiXpQN1l/P9IOiXj3dvtUkFbf13nlHW7br30EgHB7atWtr/fruZgvMP3/R2+gL9eNPPrE77rzbnnzq6eB9dK6rrbJK0OOy7LJdi0K+G8/40Ucf20MPP2J//vlncDz14qyzzlo2U+uZgv/vziU6/nGRRRa23fr0DsqvH9F7x95nnTp1tsMPO7gOo4KSzkvvI0MNYdAPnZsMFB272rPnRrb+uuvYlClTgp7vt95+2zTOU7272mSmISDt27UP/r/bX/87iZU7QTc5SF7j33gz+Odu3Za3jTfc0NZfb52Swa6UhdrXI48+bg8+9JC9+urrttSSS9hqq61adtJTqY9fuSE9pYZCpA3Arm2/8MJLQU9e23ZtbZWVVrRNN+lp+vzEjQnVMJMDDz6sMOZW7UC90osuskjq79Lo+aYNNwpgewzYx1586eXY944GuuhO1QzAaqsKg2rj2jSx7NrRo4omY+nfNTb44ktHFE4lHBj1j9UIwJov0K//XqbJX9pKBb1PPvk06LH+8suvgv0WXnghu+Haq22euecO/v8pp51hV42+NvjfpS4o9Lk+ZNARhfL03a2PnXDcMcH/1+dK9eO+W8J/cy/49LPPbOc+uxcmqf1j6aXtutFX2myzzRbsUo0A7N4r+plKGoDDQ0nUS73hBusVheFKAnD0bkG4rVbDLfWHkRcggEAdgWYVgFU6TUzpv/d+puWyyn2xK0Bq6bEHHhxXcgydejJOO+VEW23VVWKbjsKCfvCuue6G2GPoduDZg0+zd997384+97zCMaJfqOHxk3Ff2prIdsKJp9i9991f8lw32XgjO/XkEwuTTJKOmXbnEt1fAemUk463Y447sTC5JTqGUpNGRl19jQ278OLYSTgai33koENtnnnmsb32/Xu8pgtC8tOY1qefebbsRzMcnHxWOpB6dHRO+nEvNbZR53bQAftZv913rRME4yx2362PnXjSqXVuOev9XDl36b1T4jsN5epHbWDU5SOCC7DwljQAq72cdMrpds+Y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JBAJAQrgSOixLAmQAAmQAAmQAAmQgO8IUAD7bsjYYBIgARIgARIgARIggUgIUABHQo9lSYAESIAESIAESIAEfEeAAth3Q8YGkwAJkAAJkAAJkAAJREKAAjgSeixLAiRAAiRAAiRAAiTgOwIUwL4bMjaYBEiABEiABEiABEggEgIUwJHQY1kSIAESIAESIAESIAHfEaAA9t2QscEkQAIkQAIkQAIkQAKREKAAjoQey5IACZAACZAACZAACfiOAAWw74aMDSYBEiABEiABEiABEoiEAAVwJPRYlgRIgARIgARIgARIwHcEKIB9N2RsMAmQAAmQAAmQAAmQQCQEKIAjoceyJEACJEACJEACJEACviNAAey7IWODSYAESIAESIAESIAEIiFAARwJPZYlARIgARIgARIgARLwHQEKYN8NGRtMAiRAAiRAAiRAAiQQCQEK4EjosSwJkAAJkAAJkAAJkIDvCFAA+27I2GASIAESIAESIAESIIFICFAAR0KPZUkgBAJnz56VyVOny6pn18ott+SVYUMGyd3lytrW8Muvv8r6Da/Kp5/uk337D8jw+MFy/333qrw7P9wlQ4ePlO+++14aPFNXenTrIpkyZQqhJSkzayh8UmYP2CoSIAESIAG/EKAA9stIsZ2+J7B85SoZOmyk2Y98+W6R1SuWSp7rrzf/dvHiRVm4eKlMmDRF8P+NlDB3llSq+LD89ttxadSshRw69KX5W9/ePaVt65Yxwcf3nWQHSCAVEhg1ZrxsfnOL6tm112aRiePHSKGCBdW/jx8/IZ26dpeffjqm/l2iRHEZM2q4ZLrmmlRIIrpdCsY1uleKzdp8LYAhEL759ohseHWjvPve+/Lrr7+pUYR17aEHH5Aqj1aWm268UdKkSRObo+uzXl+4cEE+27dfNr72uuzctUtOnzqtelCkcCF5uMJDUvHhCpIrV84U16tP9n5qPtzRuFKlSgSIWqPBvfsOkBdeetlsf7ZsWWX54oVSrNid5t9efmW99O43IED84kdDAO/bt18aN28pp/6PDX6rXaumTBg3OsVxMRoUTT4ptpNaw7bveFs2b74sCOxS7ty55K5id0qJ4sVT5Jz2C+dYb+fp02dkbsICOXXylCcU2eKySbvWrSRr1ms95feayfps059rWM2qW7+RWrFCuveeu9XzLJRVq0uXLsm3R47ICy++LDve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JEACsWcB5piTAAmQAAmQAAmQAAnENoGYswDH9nCz9yRAAiRAAiRAAiRAAhTAnAMkQAIkQAIkQAIkQAIxRYACOKaGm50lARIgARIgARIgARKgAOYcIAESIAESIAESIAESiCkCFMAxNdzsLAmQAAmQAAmQAAmQAAUw5wAJkAAJkAAJkAAJkEBMEaAAjqnhZmdJgARIgARIgARIgAQogDkHSIAESIAESIAESIAEYooABXBMDTc7SwIkQAIkQAIkQAIkQAHMOUACJEACJEACJEACJBBTBHwhgPfvPxBTg8LOkgAJkAAJkAAJkIDfCdx5Z9EU2wVfCOD8BVMuwBQ7smwYCZAACZAACZAACVxBAocPpVwDpi8E8NBhI67g8PHSJEACJEACJEACJEACoRIYNnRwqEWSLb8vBHCy0eCFSIAESIAESIAESIAEUj0BCuBUP8TsIAmQAAmQAAmQAAmQgJUABTDnAwmQAAmQAAmQAAmQQEwRoACOqeFmZ0mABEiABEiABEiABCiAOQdIgARIgARIgARIgARiigAFcEwNNztLAiRAAiRAAiRAAiRAAcw5QAIkQAIkQAIkQAIkEFMEKIBjarjZWRIgARIgARIgARIgAQpgzgESIAESIAESIAESIIGYIkABHFPDzc6SAAmQAAmQAAmQAAlQAHMOkAAJkAAJkAAJkAAJxBQBCuCYGm52lgRIgARIgARIgARIgAKYc4AESIAESIAESIAESCCmCFAAx9Rws7MkQAIkQAIkQAIkQAIUwJwDJEACJEACJEACJEACMUWAAjimhpudJQESIAESIAESIAESoADmHCABEiABEiABEiABEogpAhTAMTXc7CwJkAAJkAAJkAAJkAAFMOcACZAACZAACZAACZBATBGgAI6p4WZnSYAESIAESIAESIAEKIA5B0iABEiABEiABEiABGKKAAVwTA03O0sCJEACJEACJEACJEABzDlAAiRAAiRAAiRAAiQQUwQogGNquNlZEiABEiABEiABEiABCmDOARIgARIgARIgARIggZgiQAEcU8PNzpIACZAACZAACZAACVAAcw6QAAmQAAmQAAmQAAnEFAEK4JgabnaWBEiABEiABEiABEiAAphzgARIgARIgARIgARIIKYIUADH1HCzsyRAAiRAAiRAAiRAAhTAnAMkQAIkQAIkQAIkQAIxRYACOKaGm50l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pCbw7bdHAo5gvv663OpIaRwZzUQCJEACJEACoRKgAA6VGPOTAAmQAAmQAAmQAAn4mgAFsK+Hj40nARIgARIgARIgARIIlQAFcKjEmJ8ESIAESIAESIAESMDXBCiAfT18bDwJkAAJkAAJkAAJkECoBCiAQyXG/CRAAiRAAiRAAiRAAr4mQAHs6+Fj40mABEiABEiABEiABEIlQAEcKjHmJwESIAESIAESIAES8DUBCmBfDx8bTwIkQAIkQAIkQAIkECoBCuBQiTE/CZAACZAACZAACZCArwlQAPt6+Nh4EiABEiABEiABEiCBUAlQAIdKjPlJgARIgARIgARIgAR8TcAXAnj5ytW+hszGkwAJkAAJkAAJkECsEWjcsH6K7bIvBHD+gkVTLEA2jARIgARIgARIgARIIDGBw4cOpFgsvhDAL69bn2IBsmEkQAIkQAIkQAIkQAKJCdR8snqKxeILAZxi6bFhJEACJEACJEACJEACviNAAey7IWODSYAESIAESIAESIAEIiFAARwJPZYlARIgARIgARIgARLwHQEKYN8NGRtMAiRAAiRAAiRAAiQQCQEK4EjosSwJkAAJkAAJkAAJkIDvCFAA+27I2GASIAESIAESIAESIIFICFAAR0KPZUmABEiABEiABEiABHxHgALYd0PGBpMACZAACZAACZAACURCgAI4EnosSwIkQAIkQAIkQAIk4DsCFMC+GzI2mARIgARIgARIgARIIBICFMCR0GNZEiABEiABEiABEiAB3xGgAPbdkLHBJEACJEACJEACJEACkRCgAI6EHsuSAAmQAAmQAAmQAAn4jgAFsO+GjA0mARIgARIgARIgARKIhAAFcCT0WJYESIAESIAESIAESMB3BCiAfTdkbDAJkAAJkAAJkAAJkEAkBCiAI6HHsiRAAiRAAiRAAiRAAr4jQAHsuyFjg0mABEiABEiABEiABCIhQAEcCT2WJQESIAESIAESIAES8B0BCmDfDRkbTAIkQAIkQAIkQAIkEAkBCuBI6LEsCZAACZAACZAACZCA7whQAPtuyNhgEiABEiABEiABEiCBSAhQAEdCj2VJgARIgARIgARIgAR8R4AC2HdDxgaTAAmQAAmQAAmQAAlEQoACOBJ6LEsCJEACJEACJEACJOA7AhTAvhsyNpgESIAESIAESIAESCASAhTAkdBjWRIgARIg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NjnUhI/Bc+fPqWIZM2QUfFAxkQAJkAAJkEAkBEq2WSJpijZfeGnH1Prip8MwIuk0y0ZOINSDMCK/ImsgARIgARIgARIggcgJ4BCMh7qvviyABzW6V/wWCi1yBKwhXAIUwOGSYzkSIAESIAESIIErSQAh0EatfP+yAH6kTD6Z1rHSlWwPr+0jAhTAPhosNpUESIAESIAESMAk0HXWFtmy58hlAXxz7mvl9XFPEw8JeCJAAewJEzORAAmQAAmQAAmkMAJV+j4nR387c1kAp017lXzKjXApbIhSbnMogFPu2LBlJEACJEACJEACzgSKt1oi/17697IARrbJ7R+WKmVvIzMScCVAAeyKiBlIgARIgARIgARSGIHXd30jPeZskzRp5D8BfN+dN0lCzyoprKlsTkokgIM7cJy0kUqVKqHiszKRAAmQAAmQAAmQQEol0HrS6/Le/qOBAjhThnSya06TlNpmtosESIAESIAESIAESIAEwiZQtv0yOXv+QqAARm0vj6glBW7KHnbFLEgCJEACJEACJEACJEACKY3A/m9/k7rD16lmBbhA4A817r9DRrd8MKW1me0hARIgARIgARIgARIggbAJwPcXPsC2Ajj7tRnlnWkNwq6cBUmABEiABEiABEiABEggpRG4t9MKOX32b3sBjL++EF9DCt+SM6W1m+0hARIgARIgARIgARIggZAJWN0fbC3A+OP9d94k8xkNImS4LEACJEACJEACJEACJJDyCDQdu1E+OnTMbFgiH2D8kvaqNPLh7MaSMX26lNcDtogESIAESIAESIAESIAEPBI49/dFQfSHfy+pYy9UshXA+OHphwpJfNP7PVbNbCRAAiRAAiRAAiRAAiSQ8gjEL31Xnnvri4CGOQrgaxATeHYTpZCZSIAESIAESIAESIAESMBvBGD0hfX3r78veBPAyNWzbllpUfUuv/WV7SUBEiABEiABEiABEiABWbTpM5m0dlciEo4WYOTMmfUa2TG1PvGRAAmQAAmQAAmQAAmQgO8IPNhttRw//VdoAhi5x7d5SB6/53bfdZgNJgESIAESIAESIAESiF0C6977Svov2GELIKgFGCVyZM0ob0+9sgdj9OjVN3ZHjz0nARIgARIgARIgAR8SmDxx3BVtdfluq+TE6XPhCWCUav9kSelUs/QV60T+gkWv2LV5YRIgARIgARIgARIggdAJHD50IPRCUSox8+U9MmfdJ461uVqAUTJ9urSyc3Yj9b9XIh058t2VuCyvSQIkQAIkQAIkQAIkECaBfPluCbNkZMX+vnBR7u6wQvC/TsmTAEbhR8rkk2kdK0XWIpYmARIgARIgARIgARIggSQk0HXWFnlz95GgV/AsgJFx3YinJP+NcUnYZFZNAiRAAiRAAiRAAiRAAuER+OanU1J90AtiOfTNtiLPAhil812fVTaOqRNei1iKBEiABEiABEiABEiABJKQQLX+z8uRn0+7XiEkAYzaetcrJ82qFHOtmBlIgARIgARIgARIgARIILkILNm0Tyas/dDT5UIWwOnSXiVvT60vWTNn8HQBZiIBEiABEiABEiABEiCBpCRw+s/zUr7barlw8V9PlwlZAKPW22+Mk3Ujn/J0AWYiARIgARIgARIgARIggaQk8OSgF+XrH096vkRYAhi1t3mihHR9qoznCzEjCZAACZAACZAACZAACUSbwMS1u2Txps9CqjZsAXzVVWnkpWE15Y6bsod0QWYmARIgARIgARIgARIggWgQgNW3xuCX5JJb2AftYmELYNST49r/196dQGdR3nsc/71v8mZPyAIJCSEghLCvgiwioliwlCpecWuV1ir23pZ6rbXVXo8cb1ttba22Huu9lWot7hVrbUFFRaFUloJg2JcQdrIAIfu+3PsMTQ9qWJK8b953Zr5zTk5QZp55/p//cM7vzJl5Jkorf3WTvGYUNgQQQAABBBBAAAEEukiguaVFU+56WScr2v7c8dmm0akAbAa+bFSWnrzzii4qldMggAACCCCAAAIIICDNf+J9ffhJx74W3OkAbBpw/1cn6CvThtALBBBAAAEEEEAAAQQCLvDS8h166MU1HT6PXwKweR74tQVXa1BWcocnwoEIIIAAAggggAACCJxLIHdvsW7+6VI1N7eca9cz/r1fArAZPS7ap/cfvUHx0REdngwHIoAAAggggAACCCBwJoHKmgZNvftl1dQ1dgrJbwHYzCI9JU7v/vw6XorrVEs4GAEEEEAAAQQQQOCzAualt+nf/6MKSqo6jePXAGxmM25Qup77wRc7PTEGQAABBBBAAAEEEECgVeDrP39b63cW+AXE7wHYzOrGywbrgVsm+mWCDIIAAggggAACCCDgboGfvLBGL3+ww28IAQnAZnb33jhec6cP9dtEGQgB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",
//     "imgData": "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IFcCBOBcVTeFRQABBBBAAAEEECAA0wYQQAABBBBAAAEEciVAAM5VdVNYBBBAAAEEEEAAAQIwbQABBBBAAAEEEEAgVwIE4FxVN4VFAAEEEEAAAQQQIADTBhBAAAEEEEAAAQRyJUAAzlV1U1gEEEAAAQQQQAABAjBtAAEEEEAAAQQQQCBXAgTgXFU3hUUAAQQQQAABBBAgANMGEEAAAQQQQAABBHIlQADOVXVTWAQQQAABBBBAAAECMG0AAQQQQAABBBBAIFcCBOBcVTeFRQABBBBAAAEEECAA0wYQQAABBBBAAAEEciVAAM5VdVNYBBBAAAEEEEAAAQIwbQABBBBAAAEEEEAgVwIE4CZQ3c8+97ydeMpp9umnn1nvnXawQw8+yGaeeeYmcGZN7xSwanp1whkhgAACCCCQNQECcCPX2IQJ31ufvnvYu+++VziTIw8/zPYesGcjn1nTe3usml6d5PWMvv3uO7v9jrvs7jH32k+TfgoYunSZ07botblts/WWNlvnzrE073/wob333vuJ2Vq3bm2rrLKSde7UqeRrfpw40R54YJw9/Mij9tbb7wT7LbTQgrbeumvbVltuYXN16eJ9v19++cXG3Huf3Xzrf+277yYE+3fs1NE2XH892/Hf29u8885T9hjTpk2zZ559zm665b/26quvBfu2atXKVlqxh+24w3bWvVu34P9Ht4mTJtnzz79oU6dO9Z6j22HJJZewJRZfrLD/K6++Zl999XWd1yexi75I5zFx4iSbPmN64U+dOna0tm3bFv7/77//bs8897z9Nvm3xOesHaPnrX+r1C3VG7MzAgjECmQmAP/008926cjLbdLESSWrcpl/LG1LLLG49ejeregLqynX/fjxb9iu/fa0Sf/7EdW5brftP+2cs86oymlHf2Bmm62zrbLySrE/RlV5wwoOEv1BaT9ze1t91VWsXbt2RUertVUFp17xS6Ltea65utgefXezDh06lDzmG2++Zdff8J/C37utsLzt8O/tKj6Har7wpptvtVdfez31IZOU4cFxDwfhzm1t27axvrvtGoS8ctvnX3xho64abb//PiXYzfde0Trp1LmT7TOgv3Xs+HedKLBce/2Ndu5559uvv/4a+/azzDKLnXzicbbtNltbixYtiva5bOQVdtY5QxI7derU0a4ZdYUtt9yydV4zY8YMu+76G+2sc88reS4KnQMP3N/22au/KRBGNx1DtkccfZz98MMPseflO4acDzv8KHv+hRdLlmvttda0IWefGVwkhLe4z7QPJ9pBcPiRx9itt91e52Xl7OLeQ+H3xJNPsxv+c1PRn0deepFttOEGhX/Txc8OO/cJ7til2aLnXR+3NO/LvgggEC+QmQCc5ktHP0B79ts9+NKPhqim1hAmT55s+x14sD32+BPBqel8hw0dYhtv9PcXbn3OOfoDs8bqq5m+0JvSEIto3SrY3HTDtXV6rmptVR/ntK+Na88H7LePHTLwwDqhyR173EMP24B99i+8VTUvlNKef3T/UiHEd1xfGXRxtN8BA+2Rxx4vOpRCnf5Tbou2fd97+dqhwuLIK0bZOUOGBj135TZ9js8750zbbNNNinarZgC+YtRVdubZQ7znogB7+GGH2IA9+9VpW2Pvu98OPfwok3O5rdQxvvjiS9tjwN723vsf+KraFIIvGja06CKvKQXgUha1CMD1dfNiswMCCHgFmmUAdqWO+8L1ijTCDrr9OPra6+3rb76xLXttHvTQRnuOKj2t5hSAZVBLq0qNK3ldXACeddZZ7YoRlwT1H7flMQCXCki6tX7lyEvL9phXOwBrmNIuu/ez77//q6dUoXDllVa0LTbfLPjsajhEuFdQd6RGj7rC5phj9kJ1VisAaxjFbv362zffflvUVOaccw5r3aq1fTdhQlEwjusNjRtSpHPeZuutgmPeceddhSEV+v9zzzWXjR51eXArX5suCE4+9Qwbfe11hXOYffbZbZuttrDFF1/cHn/iSXtw3EOF85DXSSccZ7vsvGNh/6YSgNUbu3u/AfbRxx/X+ehVKwCfdspJwRyParhV8p3DaxBAoFggswFYPSxd5pyzKCj+/PPPpvFw4U23lY89+siqBcqsNaDmFoCz5l/qfEvd0dDwnctHXBI7hrShArB6N9966+3gs6SgmeRuQdwQiC++/LJwZ0MOGoLQdZllikh8wxIuGH6R6T/RbaaZZgoC8FprrlGySVQ7AEfPZd+997JDDz6wMJwo2qsXd47hAJz2Fn24oNFzWX21VYMhBm6srsbEHnbEUcG4XLft1mcXO/H4YwrfhXfdM8YOHXRkIaD22nxTO/eswYW7Zvo+3f+gQ+yJJ58qHMOFOP3DZ59/bn122yP4b23zzTevXX3lSFt8sb/G58b1mG+4wfpBL7AbUxuto0rmP2joyu9TfjcF+n32O9AUZrUl9VXv98BDB9kDDz4U25aiATjJd1A05C64wAJ27egrTf9dDbck58A+CCBQXiCzATjuVr5+uEdefqUNOX9Y4Us9/MUTR6EfijFjx9qjjz0R9N5o4kePbt1sqy17WfduK8SOm4seR8e45b+3BT/2mkCiXpQN1l/P9IOiXj3dvtUkFbf13nlHW7br30EgHB7atWtr/fruZgvMP3/R2+gL9eNPPrE77rzbnnzq6eB9dK6rrbJK0OOy7LJdi0K+G8/40Ucf20MPP2J//vlncDz14qyzzlo2U+uZgv/vziU6/nGRRRa23fr0DsqvH9F7x95nnTp1tsMPO7gOo4KSzkvvI0MNYdAPnZsMFB272rPnRrb+uuvYlClTgp7vt95+2zTOU7272mSmISDt27UP/r/bX/87iZU7QTc5SF7j33gz+Odu3Za3jTfc0NZfb52Swa6UhdrXI48+bg8+9JC9+urrttSSS9hqq61adtJTqY9fuSE9pYZCpA3Arm2/8MJLQU9e23ZtbZWVVrRNN+lp+vzEjQnVMJMDDz6sMOZW7UC90osuskjq79Lo+aYNNwpgewzYx1586eXY944GuuhO1QzAaqsKg2rj2jSx7NrRo4omY+nfNTb44ktHFE4lHBj1j9UIwJov0K//XqbJX9pKBb1PPvk06LH+8suvgv0WXnghu+Haq22euecO/v8pp51hV42+NvjfpS4o9Lk+ZNARhfL03a2PnXDcMcH/1+dK9eO+W8J/cy/49LPPbOc+uxcmqf1j6aXtutFX2myzzRbsUo0A7N4r+plKGoDDQ0nUS73hBusVheFKAnD0bkG4rVbDLfWHkRcggEAdgWYVgFU6TUzpv/d+puWyyn2xK0Bq6bEHHhxXcgydejJOO+VEW23VVWKbjsKCfvCuue6G2GPoduDZg0+zd997384+97zCMaJfqOHxk3Ff2prIdsKJp9i9991f8lw32XgjO/XkEwuTTJKOmXbnEt1fAemUk463Y447sTC5JTqGUpNGRl19jQ278OLYSTgai33koENtnnnmsb32/Xu8pgtC8tOY1qefebbsRzMcnHxWOpB6dHRO+nEvNbZR53bQAftZv913rRME4yx2362PnXjSqXVuOev9XDl36b1T4jsN5epHbWDU5SOCC7DwljQAq72cdMrpds+Y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JBAJAQrgSOixLAmQAAmQAAmQAAmQgO8IUAD7bsjYYBIgARIgARIgARIggUgIUABHQo9lSYAESIAESIAESIAEfEeAAth3Q8YGkwAJkAAJkAAJkAAJREKAAjgSeixLAiRAAiRAAiRAAiTgOwIUwL4bMjaYBEiABEiABEiABEggEgIUwJHQY1kSIAESIAESIAESIAHfEaAA9t2QscEkQAIkQAIkQAIkQAKREKAAjoQey5IACZAACZAACZAACfiOAAWw74aMDSYBEiABEiABEiABEoiEAAVwJPRYlgRIgARIgARIgARIwHcEKIB9N2RsMAmQAAmQAAmQAAmQQCQEKIAjoceyJEACJEACJEACJEACviNAAey7IWODSYAESIAESIAESIAEIiFAARwJPZYlARIgARIgARIgARLwHQEKYN8NGRtMAiRAAiRAAiRAAiQQCQEK4EjosSwJkAAJkAAJkAAJkIDvCFAA+27I2GASIAESIAESIAESIIFICFAAR0KPZUkgBAJnz56VyVOny6pn18ott+SVYUMGyd3lytrW8Muvv8r6Da/Kp5/uk337D8jw+MFy/333qrw7P9wlQ4ePlO+++14aPFNXenTrIpkyZQqhJSkzayh8UmYP2CoSIAESIAG/EKAA9stIsZ2+J7B85SoZOmyk2Y98+W6R1SuWSp7rrzf/dvHiRVm4eKlMmDRF8P+NlDB3llSq+LD89ttxadSshRw69KX5W9/ePaVt65Yxwcf3nWQHSCAVEhg1ZrxsfnOL6tm112aRiePHSKGCBdW/jx8/IZ26dpeffjqm/l2iRHEZM2q4ZLrmmlRIIrpdCsY1uleKzdp8LYAhEL759ohseHWjvPve+/Lrr7+pUYR17aEHH5Aqj1aWm268UdKkSRObo+uzXl+4cEE+27dfNr72uuzctUtOnzqtelCkcCF5uMJDUvHhCpIrV84U16tP9n5qPtzRuFKlSgSIWqPBvfsOkBdeetlsf7ZsWWX54oVSrNid5t9efmW99O43IED84kdDAO/bt18aN28pp/6PDX6rXaumTBg3OsVxMRoUTT4ptpNaw7bveFs2b74sCOxS7ty55K5id0qJ4sVT5Jz2C+dYb+fp02dkbsICOXXylCcU2eKySbvWrSRr1ms95feayfps059rWM2qW7+RWrFCuveeu9XzLJRVq0uXLsm3R47ICy++LDve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JEACsWcB5piTAAmQAAmQAAmQAAnENoGYswDH9nCz9yRAAiRAAiRAAiRAAhTAnAMkQAIkQAIkQAIkQAIxRYACOKaGm50lARIgARIgARIgARKgAOYcIAESIAESIAESIAESiCkCFMAxNdzsLAmQAAmQAAmQAAmQAAUw5wAJkAAJkAAJkAAJkEBMEaAAjqnhZmdJgARIgARIgARIgAQogDkHSIAESIAESIAESIAEYooABXBMDTc7SwIkQAIkQAIkQAIkQAHMOUACJEACJEACJEACJBBTBHwhgPfvPxBTg8LOkgAJkAAJkAAJkIDfCdx5Z9EU2wVfCOD8BVMuwBQ7smwYCZAACZAACZAACVxBAocPpVwDpi8E8NBhI67g8PHSJEACJEACJEACJEACoRIYNnRwqEWSLb8vBHCy0eCFSIAESIAESIAESIAEUj0BCuBUP8TsIAmQAAmQAAmQAAmQgJUABTDnAwmQAAmQAAmQAAmQQEwRoACOqeFmZ0mABEiABEiABEiABCiAOQdIgARIgARIgARIgARiigAFcEwNNztLAiRAAiRAAiRAAiRAAcw5QAIkQAIkQAIkQAIkEFMEKIBjarjZWRIgARIgARIgARIgAQpgzgESIAESIAESIAESIIGYIkABHFPDzc6SAAmQAAmQAAmQAAlQAHMOkAAJkAAJkAAJkAAJxBQBCuCYGm52lgRIgARIgARIgARIgAKYc4AESIAESIAESIAESCCmCFAAx9Rws7MkQAIkQAIkQAIkQAIUwJwDJEACJEACJEACJEACMUWAAjimhpudJQESIAESIAESIAESoADmHCABEiABEiABEiABEogpAhTAMTXc7CwJkAAJkAAJkAAJkAAFMOcACZAACZAACZAACZBATBGgAI6p4WZnSYAESIAESIAESIAEKIA5B0iABEiABEiABEiABGKKAAVwTA03O0sCJEACJEACJEACJEABzDlAAiRAAiRAAiRAAiQQUwQogGNquNlZEiABEiABEiABEiABCmDOARIgARIgARIgARIggZgiQAEcU8PNzpIACZAACZAACZAACVAAcw6QAAmQAAmQAAmQAAnEFAEK4JgabnaWBEiABEiABEiABEiAAphzgARIgARIgARIgARIIKYIUADH1HCzsyRAAiRAAiRAAiRAAhTAnAMkQAIkQAIkQAIkQAIxRYACOKaGm50l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pCbw7bdHAo5gvv663OpIaRwZzUQCJEACJEACoRKgAA6VGPOTAAmQAAmQAAmQAAn4mgAFsK+Hj40nARIgARIgARIgARIIlQAFcKjEmJ8ESIAESIAESIAESMDXBCiAfT18bDwJkAAJkAAJkAAJkECoBCiAQyXG/CRAAiRAAiRAAiRAAr4mQAHs6+Fj40mABEiABEiABEiABEIlQAEcKjHmJwESIAESIAESIAES8DUBCmBfDx8bTwIkQAIkQAIkQAIkECoBCuBQiTE/CZAACZAACZAACZCArwlQAPt6+Nh4EiABEiABEiABEiCBUAlQAIdKjPlJgARIgARIgARIgAR8TcAXAnj5ytW+hszGkwAJkAAJkAAJkECsEWjcsH6K7bIvBHD+gkVTLEA2jARIgARIgARIgARIIDGBw4cOpFgsvhDAL69bn2IBsmEkQAIkQAIkQAIkQAKJCdR8snqKxeILAZxi6bFhJEACJEACJEACJEACviNAAey7IWODSYAESIAESIAESIAEIiFAARwJPZYlARIgARIgARIgARLwHQEKYN8NGRtMAiRAAiRAAiRAAiQQCQEK4EjosSwJkAAJkAAJkAAJkIDvCFAA+27I2GASIAESIAESIAESIIFICFAAR0KPZUmABEiABEiABEiABHxHgALYd0PGBpMACZAACZAACZAACURCgAI4EnosSwIkQAIkQAIkQAIk4DsCFMC+GzI2mARIgARIgARIgARIIBICFMCR0GNZEiABEiABEiABEiAB3xGgAPbdkLHBJEACJEACJEACJEACkRCgAI6EHsuSAAmQAAmQAAmQAAn4jgAFsO+GjA0mARIgARIgARIgARKIhAAFcCT0WJYESIAESIAESIAESMB3BCiAfTdkbDAJkAAJkAAJkAAJkEAkBCiAI6HHsiRAAiRAAiRAAiRAAr4jQAHsuyFjg0mABEiABEiABEiABCIhQAEcCT2WJQESIAESIAESIAES8B0BCmDfDRkbTAIkQAIkQAIkQAIkEAkBCuBI6LEsCZAACZAACZAACZCA7whQAPtuyNhgEiABEiABEiABEiCBSAhQAEdCj2VJgARIgARIgARIgAR8R4AC2HdDxgaTAAmQAAmQAAmQAAlEQoACOBJ6LEsCJEACJEACJEACJOA7AhTAvhsyNpgESIAESIAESIAESCASAhTAkdBjWRIgARIg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NjnUhI/Bc+fPqWIZM2QUfFAxkQAJkAAJkEAkBEq2WSJpijZfeGnH1Prip8MwIuk0y0ZOINSDMCK/ImsgARIgARIgARIggcgJ4BCMh7qvviyABzW6V/wWCi1yBKwhXAIUwOGSYzkSIAESIAESIIErSQAh0EatfP+yAH6kTD6Z1rHSlWwPr+0jAhTAPhosNpUESIAESIAESMAk0HXWFtmy58hlAXxz7mvl9XFPEw8JeCJAAewJEzORAAmQAAmQAAmkMAJV+j4nR387c1kAp017lXzKjXApbIhSbnMogFPu2LBlJEACJEACJEACzgSKt1oi/17697IARrbJ7R+WKmVvIzMScCVAAeyKiBlIgARIgARIgARSGIHXd30jPeZskzRp5D8BfN+dN0lCzyoprKlsTkokgIM7cJy0kUqVKqHiszKRAAmQAAmQAAmQQEol0HrS6/Le/qOBAjhThnSya06TlNpmtosESIAESIAESIAESIAEwiZQtv0yOXv+QqAARm0vj6glBW7KHnbFLEgCJEACJEACJEACJEACKY3A/m9/k7rD16lmBbhA4A817r9DRrd8MKW1me0hARIgARIgARIgARIggbAJwPcXPsC2Ajj7tRnlnWkNwq6cBUmABEiABEiABEiABEggpRG4t9MKOX32b3sBjL++EF9DCt+SM6W1m+0hARIgARIgARIgARIggZAJWN0fbC3A+OP9d94k8xkNImS4LEACJEACJEACJEACJJDyCDQdu1E+OnTMbFgiH2D8kvaqNPLh7MaSMX26lNcDtogESIAESIAESIAESIAEPBI49/dFQfSHfy+pYy9UshXA+OHphwpJfNP7PVbNbCRAAiRAAiRAAiRAAiSQ8gjEL31Xnnvri4CGOQrgaxATeHYTpZCZSIAESIAESIAESIAESMBvBGD0hfX3r78veBPAyNWzbllpUfUuv/WV7SUBEiABEiABEiABEiABWbTpM5m0dlciEo4WYOTMmfUa2TG1PvGRAAmQAAmQAAmQAAmQgO8IPNhttRw//VdoAhi5x7d5SB6/53bfdZgNJgESIAESIAESIAESiF0C6977Svov2GELIKgFGCVyZM0ob0+9sgdj9OjVN3ZHjz0nARIgARIgARIgAR8SmDxx3BVtdfluq+TE6XPhCWCUav9kSelUs/QV60T+gkWv2LV5YRIgARIgARIgARIggdAJHD50IPRCUSox8+U9MmfdJ461uVqAUTJ9urSyc3Yj9b9XIh058t2VuCyvSQIkQAIkQAIkQAIkECaBfPluCbNkZMX+vnBR7u6wQvC/TsmTAEbhR8rkk2kdK0XWIpYmARIgARIgARIgARIggSQk0HXWFnlz95GgV/AsgJFx3YinJP+NcUnYZFZNAiRAAiRAAiRAAiRAAuER+OanU1J90AtiOfTNtiLPAhil812fVTaOqRNei1iKBEiABEiABEiABEiABJKQQLX+z8uRn0+7XiEkAYzaetcrJ82qFHOtmBlIgARIgARIgARIgARIILkILNm0Tyas/dDT5UIWwOnSXiVvT60vWTNn8HQBZiIBEiABEiABEiABEiCBpCRw+s/zUr7barlw8V9PlwlZAKPW22+Mk3Ujn/J0AWYiARIgARIgARIgARIggaQk8OSgF+XrH096vkRYAhi1t3mihHR9qoznCzEjCZAACZAACZAACZAACUSbwMS1u2Txps9CqjZsAXzVVWnkpWE15Y6bsod0QWYmARIgARIgARIgARIggWgQgNW3xuCX5JJb2AftYmELYNST49r/196dQGdR3nsc/71v8mZPyAIJCSEghLCvgiwioliwlCpecWuV1ir23pZ6rbXVXo8cb1ttba22Huu9lWot7hVrbUFFRaFUloJg2JcQdrIAIfu+3PsMTQ9qWJK8b953Zr5zTk5QZp55/p//cM7vzJl5Jkorf3WTvGYUNgQQQAABBBBAAAEEukiguaVFU+56WScr2v7c8dmm0akAbAa+bFSWnrzzii4qldMggAACCCCAAAIIICDNf+J9ffhJx74W3OkAbBpw/1cn6CvThtALBBBAAAEEEEAAAQQCLvDS8h166MU1HT6PXwKweR74tQVXa1BWcocnwoEIIIAAAggggAACCJxLIHdvsW7+6VI1N7eca9cz/r1fArAZPS7ap/cfvUHx0REdngwHIoAAAggggAACCCBwJoHKmgZNvftl1dQ1dgrJbwHYzCI9JU7v/vw6XorrVEs4GAEEEEAAAQQQQOCzAualt+nf/6MKSqo6jePXAGxmM25Qup77wRc7PTEGQAABBBBAAAEEEECgVeDrP39b63cW+AXE7wHYzOrGywbrgVsm+mWCDIIAAggggAACCCDgboGfvLBGL3+ww28IAQnAZnb33jhec6cP9dtEGQgB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",
//     "birthdate": "2025-03-04",
//     "mobilenumber": "8466832029",
//     "whatsappno": "8466832029",
//     "gender": "male",
//     "maritalstatus": "Married",
//     "college": "InfoZIT",
//     "zipcode": "521229",
//     "country": "India",
//     "state": "Andhra Pradesh",
//     "native": "Hyderabad City",
//     "area": "madhapur",
//     "parentsname": "saaaaa",
//     "parentsnumber": "2345676234",
//     "educationtype": "B.Tech",
//     "marks": "23",
//     "academicyear": "1234",
//     "enquirydate": "2025-03-04",
//     "enquirytakenby": "ERP",
//     "enquirytakenbyId": 104,
//     "coursepackage": "Employment Program",
//     "coursepackageId": 18,
//     "courses": "Full Stack Development - Python",
//     "coursesId": 247,
//     "leadsource": [
//         {
//             "source": "Just Dial"
//         }
//     ],
//     "leadsourceId": 6,
//     "branch": "Hitech City",
//     "branchId": 1,
//     "modeoftraining": "Online",
//     "admissiondate": "2025-03-04",
//     "validitystartdate": "2025-03-04",
//     "validityenddate": "2026-03-04",
//     "user_id": 104,
//     "feedetails": [
//         {
//             "id": 1741063291478,
//             "feetype": "Admission Fee",
//             "amount": 500,
//             "discount": 0,
//             "taxamount": 76.27118644067798,
//             "totalamount": 500
//         },
//         {
//             "id": 1741063294181,
//             "feetype": "fee",
//             "amount": 34220,
//             "discount": 0,
//             "taxamount": 5220,
//             "totalamount": 34220
//         }
//     ],
//     "feedetailsbilling": [
//         {
//             "id": 1741063291478,
//             "feetype": "Admission Fee",
//             "feewithtax": 500,
//             "feewithouttax": 423.7288135593221,
//             "feetax": 76.27118644067792
//         },
//         {
//             "id": 1741063294181,
//             "feetype": "Course Fee",
//             "feewithtax": 23954,
//             "feewithouttax": 20300,
//             "feetax": 3654
//         },
//         {
//             "id": 1741063294181,
//             "feetype": "Material Fee",
//             "feewithtax": 10266,
//             "feewithouttax": 10266,
//             "feetax": 0
//         }
//     ],
//     "addfee": false,
//     "duedatetype": "",
//     "admissionremarks": "ssff",
//     "assets": [
//         "bag",
//         "laptop"
//     ],
//     "installments": [],
//     "totalpaidamount": 0,
//     "nextduedate": null,
//     "status": 1,
//     "admissionFee": [],
//     "extra_discount": [],
//     "refund": null,
//     "certificate_status": [
//         {
//             "courseStartDate": "",
//             "courseEndDate": "",
//             "certificateStatus": "",
//             "requistedDate": "",
//             "issuedDate": ""
//         }
//     ],
//     "totalinstallments": [],
//     "totaldiscount": 0,
//     "grosstotal": 34720,
//     "totalfeewithouttax": 20723.728813559323,
//     "totaltax": 3730.271186440678,
//     "grandtotal": 24454,
//     "materialfee": 10266,
//     "finaltotal": 34720,
//     "dueamount": 34720
// }