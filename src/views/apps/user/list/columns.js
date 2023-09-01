// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
import { store } from "@store/store";
import { getUser, deleteUser } from "../store";
import { Stepper } from "react-form-stepper";

// ** Icons Imports
import {
  Download,
  Edit,
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  Trash2,
  Archive,
  FileMinus,
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
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../../../../config/cookies";
import {
  getRejectReasonService,
  getTrackingStatusValues,
} from "../../../../services/dashboardService";
import moment from "moment/moment";
import { getSingleApplicationList } from "../../../../redux/slices/appformSlice";
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
    applicant_name: {
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
      {/* <Icon
        size={18}
        className={`${roleObj[row.role] ? roleObj[row.role].class : ""} me-50`}
      />
      {row.role} */}
    </span>
  );
};

const statusModal = (row) => {
  const [showModal, setShowModal] = useState(false);
  const [trackingValues, setTrackingValues] = useState([]);
  const [cardType, setCardType] = useState("");

  const opentrackingModal = async (data) => {
    const response = await getTrackingStatusValues(data.application_id);
    setTrackingValues(response);
    setShowModal(true);
  };

  const statusObj = {
    PENDING: "light-warning",
    APPROVED: "light-success",
    REJECTED: "light-danger",
  };

  // const ConnectorStyleProps = {
  //   stepSize: "3rem",
  // };

  // const StepStyleDTO1 = {
  //   inactiveBgColor: "#e0e0e0",
  //   activeBgColor: !trackingValues.is_rejected ? "#F7BE16" : "#FF0000",
  //   completedBgColor: "#27AA80",
  //   borderRadius: "50px",
  // };

  // const getApprovedValue = () => {
  //   console.log("trackingValues trackingValues trackingValues", trackingValues);
  //   let activeCount = 1;
  //   if (
  //     trackingValues.zonal_officer_approval ||
  //     trackingValues.zonal_officer_rejected
  //   ) {
  //     activeCount = activeCount + 1;
  //   }
  //   return activeCount;
  // };

  const dateFormat = (date) => {
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  };
  const colorClassAdd = (data) => {
    let color = "";
    switch (data.color) {
      case "#27AA80":
        color = "approve";
        break;
      case "#FF0000":
        color = "reject";
        break;
      case "#F7BE16":
        color = "pending";
        break;
      case "#e0e0e0":
        color = "defualt";
        break;
      default:
        break;
    }
    return color;
  };

  return (
    <>
      <Badge
        className="text-capitalize"
        style={{ cursor: "pointer" }}
        onClick={() => opentrackingModal(row)}
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
        <ModalBody className="pb-0">
          <h3 className="text-center mb-1">Application Status</h3>
          {/* <Row tag="form" className="gy-1 gx-2 mt-75">
            <Col xs={12}>
              <Stepper
                style={{ pointerEvents: "none" }}
                steps={[
                  { label: "Applicant", active: true, completed: true },
                  {
                    label: "Approved by Zonal officer",
                    active:
                      trackingValues.zonal_officer_approval === false &&
                      trackingValues.zonal_officer_rejected === false,
                    completed:
                      trackingValues.zonal_officer_approval ||
                      trackingValues.zonal_officer_rejected === false,
                  },
                  {
                    label: "Approved by Deputy Mamlatdar",
                    active:
                      trackingValues.deputy_mamlatdar_approval === false &&
                      trackingValues.deputy_mamlatdar_rejected === false,
                    // completed:
                    //   trackingValues.deputy_mamlatdar_approval ||
                    //   trackingValues.deputy_mamlatdar_rejected === false,
                  },
                  {
                    label: "Approved Approved",
                    completed: trackingValues.is_approved,
                  },
                ]}
                // activeStep={getApprovedValue()}
                connectorStyleConfig={ConnectorStyleProps}
                styleConfig={StepStyleDTO1}
              />
            </Col>
          </Row> */}
          <Row tag="form" className="gy-1 gx-2 mt-75">
            <Col xs={12}>
              <div className="wrapper">
                <ol className="c-timeline">
                  {trackingValues.map((item, i) => (
                    <li className="c-timeline__item" key={i}>
                      <div
                        className={`c-timeline__content ${colorClassAdd(item)}`}
                      >
                        <h5 className="c-timeline__title">{item.Label}</h5>
                        <p className="c-timeline__desc">{item.Status}</p>
                      </div>
                      {item.created_at ? (
                        <time>
                          <sup>{dateFormat(item.created_at) || ""}</sup>
                        </time>
                      ) : (
                        <time>
                          <sup></sup>
                        </time>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

const statusRejectModal = (row) => {
  const [showModal, setShowModal] = useState(false);
  const [cardType, setCardType] = useState("");
  const handleDisplayReason = async (item) => {
    setShowModal(true);
    console.log("row-=-=-=", item);
    const response = await getRejectReasonService(item.id);
    console.log("response-=-=-=-=", response);
  };
  return (
    <>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleDisplayReason(row)}
      >
        <b>
          <FileMinus size={14} className="me-50" />
          <span className="align-middle">Reason</span>
        </b>
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

function formatDateToCustom(inputDateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(inputDateString);
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${monthName} ${year}`;
}

const role = getCookie("role");

const actionModal = (row) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleEditApplication = async (row) => {
    await dispatch(getSingleApplicationList(row.id));
    navigate("/add");
  };

  return (
    <>
      <div className="column-action">
        {row.status !== "REJECTED" ? (
          role === "User" ? (
            row.status !== "APPROVED" ? (
              <Link
                className="w-100"
                onClick={(e) => handleEditApplication(row)}
              >
                <Archive size={14} className="me-50" />
                <span className="align-middle">Edit</span>
              </Link>
            ) : (
              <Link
                tag="a"
                className="w-100"
                to={`/application-detail/${row.id}`}
              // onClick={(e) => e.preventDefault()}
              >
                <Archive size={14} className="me-50" />
                <span className="align-middle">Details</span>
              </Link>
            )
          ) : (
            <Link
              tag="a"
              className="w-100"
              to={`/application-detail/${row.id}`}
            // onClick={(e) => e.preventDefault()}
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">Details</span>
            </Link>
          )
        ) : (
          statusRejectModal(row)
        )}
      </div>
    </>
  );
};

export const columns = [
  {
    name: "Applicant Date",
    sortable: true,
    minWidth: "172px",
    sortField: "role",
    selector: (row) => formatDateToCustom(row.created_at),
    cell: (row) => (
      <span className="text-success">{formatDateToCustom(row.created_at)}</span>
    ),
  },
  {
    name: "Applicant Name",
    sortable: true,
    minWidth: "172px",
    sortField: "applicant_name",
    selector: (row) => `${row.firstname} ${row.middlename} ${row.lastname}`,
    cell: (row) => (
      <span className="text-primary">{`${row.firstname} ${row.middlename} ${row.lastname}`}</span>
    ),
  },
  {
    name: "District",
    sortable: true,
    minWidth: "172px",
    sortField: "district",
    selector: (row) => row.district.name,
    cell: (row) => <span className="text-info">{row.district.name}</span>,
  },
  {
    name: "Taluka",
    minWidth: "138px",
    sortable: true,
    sortField: "taluka",
    selector: (row) => row.taluka.name,
    cell: (row) => <span className="text-info">{row.taluka.name}</span>,
  },
  {
    name: "Zone",
    minWidth: "230px",
    sortable: true,
    sortField: "zone",
    selector: (row) => row.zone.name,
    cell: (row) => <span className="text-info">{row.zone.name}</span>,
  },
  {
    name: "Status",
    minWidth: "138px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.status,
    cell: (row) => statusModal(row),
  },
  {
    name: "Actions",
    minWidth: "100px",
    sortable: false,
    sortField: "status",
    selector: (row) => row.status,
    cell: (row) => actionModal(row),
  },
];
