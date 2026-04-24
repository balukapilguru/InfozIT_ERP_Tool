import React from "react";
import { FaFileAlt, FaFileImage, FaFileVideo, FaFile } from "react-icons/fa";
import { Button, Badge, Card } from "react-bootstrap";
import { capitalizeFirstLetter } from "../../../../utils/Utils";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

const getFileIcon = (type) => {
  const lowerType = type.toLowerCase();
  if (["pdf", "doc", "docx"].includes(lowerType)) {
    return <FaFileAlt size={10} />;
  }
  if (["jpg", "png", "gif"].includes(lowerType)) {
    return <FaFileImage size={10} />;
  }
  if (["mp4", "avi", "mov"].includes(lowerType)) {
    return <FaFileVideo size={10} />;
  }
  return <FaFile size={10} />;
};

const DocumentRow = ({ title, description, type, thumbnail, onEdit, onDelete,onView }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body
        className="
          d-flex
          flex-wrap
          align-items-start
          justify-content-between
          gap-3
        "
      >
        {/* Thumbnail */}
        <div
          className="
            d-flex
            justify-content-center
            align-items-center
            flex-shrink-0
          "
          style={{ width: 84, height: 84 }}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="rounded"
              style={{
                width: 84,
                height: 84,
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded"
              style={{
                width: 84,
                height: 84,
                fontSize: "0.75rem",
                color: "#888",
              }}
            >
              No Thumbnail
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="
            flex-grow-1
            min-width-0
            text-start
          "
          style={{ flexBasis: "50%" }}
        >
          <h5 className="mb-1 text-truncate">{capitalizeFirstLetter(title)}</h5>
          <p
            className="mb-2 text-muted small"
            title={description}
            style={{
              maxHeight: "3rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {description.length > 25
              ? description.slice(0, 25) + "..."
              : description}
          </p>
          <Badge bg="secondary" className="text-uppercase fs-sm">
            {getFileIcon(type)} <span className="ms-1">{type}</span>
          </Badge>
        </div>

        {/* Actions */}
        <div
          className="
            d-flex
            align-items-start
            gap-2
            ms-auto
          "
        >
          <Button variant="warning" size="sm" onClick={onEdit}>
            <CiEdit size={16} title="edit"/>
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <MdDelete size={16} title="delete"/>
          </Button>
          <Button variant="primary" size="sm" onClick={onView}>
            <FaEye size={16} title="preview"/>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DocumentRow;
