import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import BackButton from "../../../components/backbutton/BackButton";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";
import { ERPApi } from "../../../../serviceLayer/interceptor";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;
const socket = io(SOCKET_SERVER_URL)

export const ticketDataLoaderById = async ({ params }) => {
    const id = params.id;
    try {
        const response = await ERPApi.get(`/ticket/byId/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ticket data:", error);
        return null;
    }
};

const TicketsView = () => {
    const location = useLocation();
    const unreadMessageIds = location.state?.unreadMessageIds || [];
    const chatBoxRef = useRef(null)
    const ticketData = useLoaderData();
    const { AuthState } = useAuthContext();
    const { id: ticketId } = useParams();
    const userId = AuthState?.user?.id;
    const senderRole = "Support";

    const [messages, setMessages] = useState(ticketData?.messages || []);
    const [text, setText] = useState("");
    useEffect(() => {
        if (!ticketId) return;
        socket.on("messageCreated", (message) => {
            setMessages((prev) => {
                const isDuplicate = prev.some((msg) => msg.createdAt === message.createdAt);
                return isDuplicate ? prev : [...prev, message];
            });
        });

        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
        return () => {
            socket.off("messageCreated");
        };
    }, [ticketId]); // Only listen for new messages

    useEffect(() => {
        if (ticketId && unreadMessageIds.length > 0) {
            socket.emit("messageRead", { messageIds: unreadMessageIds });
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    unreadMessageIds.includes(msg.id) ? { ...msg, isRead: 1 } : msg
                )
            );
        }
    }, [ticketId, unreadMessageIds]); // Handle initial read marking

    const sendMessage = () => {
        if (text.trim() || image) {
            const messageData = {
                ticketId,
                message: text,
                supportId: userId,
                senderRole,
                createdAt: new Date().toISOString(),
            };

            socket.emit("message", messageData);
            setText("");
        }
    };
    const formatTime = (timestamp) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).format(new Date(timestamp));
    };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imgSrc) => {
        setSelectedImage(`https://teksversity.s3.us-east-1.amazonaws.com/erp/studentManagement/regStudentImgs/${ticketData?.ticket_screenshot}`);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedImage(null);
    };
    useEffect(() => {
        if (!ticketId || !userId) return;
        const roomName = `ticket_${ticketId}`;
        socket.emit("joinRoom", {
            ticketId,
            roomName,
            senderId: userId,
            senderRole,
        });
        return () => {
            socket.emit("leaveRoom", { roomName });
        };

    }, [ticketId, userId]);
    return (
        <div >
            <BackButton heading="Ticket Details" content="Back" to="/" />
            <div className="container mt-3">
                <div className="row mt-3 bg-light p-3 rounded shadow-sm">
                    {/* Left Side - Profile Details */}
                    <div className="col-md-4 p-4 rounded shadow-lg bg-light">
                        <h5 className="text-center text_primary fw-bold mb-3">Ticket Information</h5>

                        <div className="card border-0 shadow-sm bg-white rounded d-flex flex-column" style={{ maxHeight: "450px" }}>
                            {/* Fixed Header Section */}
                            <div className="p-3 bg-white border-bottom sticky-top">
                                <div className="d-flex align-items-center">
                                    <div className="avatar bg_primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: "50px", height: "50px", fontSize: "20px", fontWeight: "bold" }}>
                                        {ticketData?.student_detail?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ms-3" style={{ minWidth: "0" }}>
                                        <h6 className="mb-0">{ticketData?.student_detail?.name}</h6>
                                        <small
                                            className="text-muted text-truncate d-block"
                                            style={{
                                                maxWidth: "250px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                            title={ticketData?.student_detail?.email}
                                        >
                                            {ticketData?.student_detail?.email}
                                        </small>
                                    </div>

                                </div>
                            </div>

                            {/* Scrollable Content Section */}
                            <div className="p-3 flex-grow-1 overflow-auto" style={{ maxHeight: "400px" }}>
                                <p className="mb-2"><i className="bi bi-hash text-primary me-2"></i><strong>Ticket No:</strong> {ticketData?.ticketNumber}</p>
                                <p className="mb-2"><i className="bi bi-tag text-success me-2"></i><strong>Subject:</strong> {ticketData?.title}</p>

                                {/* Scrollable Description */}
                                <div >
                                    <i className="bi bi-chat-left-text text-warning me-2"></i>
                                    <>Description:</>
                                    <span className="text-muted"> {ticketData?.description} </span>
                                </div>
                                <img style={{ width: "320px", height: "200px" }}
                                    src={`https://teksversity.s3.us-east-1.amazonaws.com/erp/studentManagement/regStudentImgs/${ticketData?.ticket_screenshot}`}
                                    onClick={handleImageClick}
                                />
                            </div>
                        </div>
                    </div>



                    {/* Right Side - Chat Box */}
                    <div className="col-md-8 p-3">
                        <div className="chat-box p-3 bg-white rounded" ref={chatBoxRef}
                            style={{ maxHeight: "400px", minHeight: "400px", overflowY: "auto", border: "1px solid #ccc" }}>

                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`d-flex flex-column my-2 ${msg.senderRole === "Student" ? "align-items-start" : "align-items-end"}`}>

                                        <div className={`message-bubble p-2 rounded text-white ${msg.senderRole === "Support" ? "bg_primary" : "bg_primary"}`}>
                                            {msg.message}
                                        </div>

                                        {/* Timestamp placed correctly */}
                                        <small className={`text-muted mt-1 ${msg.senderRole === "Support" ? "text-start" : "text-end"}`}>
                                            {formatTime(msg.createdAt)}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">No messages yet.</p>
                            )}
                        </div>

                        {/* Input Box */}
                        <div className="input-group mt-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                disabled={ticketData?.status === "Resolved"}
                            />
                            <button
                                className="btn btn_primary"
                                onClick={sendMessage}
                                disabled={ticketData?.status === "Resolved"}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div className="modal show d-block" tabIndex="-1" onClick={handleClose}>
                        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" onClick={handleClose}></button>
                                </div>
                                <div className="modal-body text-center">
                                    <img src={selectedImage} alt="Ticket Screenshot" className="img-fluid  h-100 object-fit-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TicketsView;
