// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
import { store } from "@store/store";
import { getUser, deleteUser } from "../store";
import { Stepper } from "react-form-stepper";
import { Edit } from "react-feather";

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
import { useDispatch } from "react-redux";
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

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleEditApplication = async (row) => {
    await dispatch(getSingleApplicationList(row.id));
    navigate("/add");
  };
  return (
    <>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => handleEditApplication(row)}
      >
        <Edit size={20} />
        Edit
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
    name: "Actions",
    minWidth: "100px",
    sortable: false,
    sortField: "status",
    selector: (row) => row.status,
    cell: (row) => statusDownloadModal(row),
  },
  // {
  //   name: 'Actions',
  //   minWidth: '100px',
  //   cell: row => (
  //     <div className='column-action'>
  //       <UncontrolledDropdown>
  //         <DropdownToggle tag='div' className='btn btn-sm'>
  //           <MoreVertical size={14} className='cursor-pointer' />
  //         </DropdownToggle>
  //         <DropdownMenu>
  //           <DropdownItem
  //             tag={Link}
  //             className='w-100'
  //             to={`/apps/user/view/${row.id}`}
  //             onClick={() => store.dispatch(getUser(row.id))}
  //           >
  //             <FileText size={14} className='me-50' />
  //             <span className='align-middle'>Details</span>
  //           </DropdownItem>
  //           <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
  //             <Archive size={14} className='me-50' />
  //             <span className='align-middle'>Edit</span>
  //           </DropdownItem>
  //           <DropdownItem
  //             tag='a'
  //             href='/'
  //             className='w-100'
  //             onClick={e => {
  //               e.preventDefault()
  //               store.dispatch(deleteUser(row.id))
  //             }}
  //           >
  //             <Trash2 size={14} className='me-50' />
  //             <span className='align-middle'>Delete</span>
  //           </DropdownItem>
  //         </DropdownMenu>
  //       </UncontrolledDropdown>
  //     </div>
  //   )
  // }
];
