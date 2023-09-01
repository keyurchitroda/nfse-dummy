// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
import { store } from "@store/store";
import { getUser, deleteUser } from "../store";
import { Stepper } from "react-form-stepper";
import { Download } from "react-feather";

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive,
} from "react-feather";

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
} from "reactstrap";

import { Fragment, useState } from "react";
// ** Renders Client Columns
const renderClient = (row) => {
  if (row.avatar.length) {
    return <Avatar className="me-1" img={row.avatar} width="32" height="32" />;
  } else {
    return (
      <Avatar
        initials
        className="me-1"
        color={row.avatarColor || "light-primary"}
        content={row.fullName || "John Doe"}
      />
    );
  }
};

// ** Renders Role Columns
const renderRole = (row) => {
  const roleObj = {
    subscriber: {
      class: "text-primary",
      icon: User,
    },
    maintainer: {
      class: "text-success",
      icon: Database,
    },
    editor: {
      class: "text-info",
      icon: Edit2,
    },
    author: {
      class: "text-warning",
      icon: Settings,
    },
    admin: {
      class: "text-danger",
      icon: Slack,
    },
  };

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2;

  return (
    <span className="text-truncate text-capitalize align-middle">
      <Icon
        size={18}
        className={`${roleObj[row.role] ? roleObj[row.role].class : ""} me-50`}
      />
      {row.role}
    </span>
  );
};

const statusObj = {
  pending: "light-warning",
  active: "light-success",
  inactive: "light-secondary",
};

const ConnectorStyleProps = {
  stepSize: "3rem",
};

const StepStyleDTO1 = {
  inactiveBgColor: "#e0e0e0",
  activeBgColor: "#F7BE16",
  completedBgColor: "#27AA80",
  borderRadius: "50px",
};

const statusModal = (row) => {
  const [showModal, setShowModal] = useState(false);
  const [cardType, setCardType] = useState("");
  return (
    <>
      <Badge
        className="text-capitalize"
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
        color={statusObj[row.status]}
        pill
      >
        {row.status}
      </Badge>
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered"
        onClosed={() => setCardType("")}
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowModal(!showModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h3 className="text-center mb-1">Application Status</h3>
          <Row tag="form" className="gy-1 gx-2 mt-75">
            <Col xs={12}>
              <Stepper
                style={{ pointerEvents: "none" }}
                steps={[
                  { label: "Applicant" },
                  { label: "Approved by Mamlatdar" },
                  { label: "Collector Verification" },
                ]}
                activeStep={1}
                connectorStyleConfig={ConnectorStyleProps}
                styleConfig={StepStyleDTO1}
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

const statusDownloadModal = (row) => {
  const [showModal, setShowModal] = useState(false);
  const [cardType, setCardType] = useState("");
  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
        <Download size={20} />
      </div>
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="modal-dialog-centered"
        onClosed={() => setCardType("")}
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowModal(!showModal)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <h3 className="text-center mb-1">Application Reject by Mamlatdar </h3>
          <p>Reason</p>
          <Input
            type="textarea"
            name="text"
            id="exampleText"
            rows="3"
            value="All Proof Are wrong you need check Proof."
            readOnly
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export const columns = [
  {
    name: "Full Name",
    sortable: true,
    minWidth: "300px",
    sortField: "fullName",
    selector: (row) => {
      `${row.firstname ? row.firstname : ""} ${
        row.middlename ? row.middlename : "N/A"
      } ${row.lastname ? row.lastname : ""}`;
    },
    cell: (row) => (
      <span className="text-capitalize">{`${
        row.firstname ? row.firstname : ""
      } ${row.middlename ? row.middlename : "N/A"} ${
        row.lastname ? row.lastname : ""
      }`}</span>
    ),
  },
  {
    name: "Email ID",
    minWidth: "138px",
    sortable: true,
    sortField: "email",
    selector: (row) => row.email,
    cell: (row) => <span className="text-capitalize">{row.email}</span>,
  },
  {
    name: "Phone Number",
    minWidth: "138px",
    sortable: true,
    sortField: "contact",
    selector: (row) => row.mobile_number,
    cell: (row) => <span className="text-capitalize">{row.mobile_number}</span>,
  },
  {
    name: "Role",
    minWidth: "138px",
    sortable: true,
    sortField: "role",
    selector: (row) => row.role,
    cell: (row) => <span className="text-capitalize">{row.role}</span>,
  },
];
