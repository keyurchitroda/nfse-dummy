// ** User List Component
import Table from "./Table";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from "react-feather";

// ** Styles
import "@styles/react/apps/app-users.scss";
import { useEffect, useState } from "react";
import { getCardCounts } from "../../../../services/dashboardService";
import {
  filterApplicationListByUser,
  getApplicationListByUser,
} from "../../../../redux/slices/dashboardSlice";
import { useDispatch } from "react-redux";

const UsersList = () => {
  const [countObj, setCountObj] = useState({});

  useEffect(() => {
    getCardAllCountWithRoles();
  }, []);

  const getCardAllCountWithRoles = async () => {
    const response = await getCardCounts();
    if (response) {
      setCountObj(response);
    }
  };

  const dispatch = useDispatch();

  const [type, setType] = useState("");

  const handleClick = async (type) => {
    let reqData;
    setType(type);
    switch (type) {
      case "Approved":
        reqData = { status: { value: "Approve" } };
        await dispatch(filterApplicationListByUser(1, reqData));
        break;
      case "Rejected":
        reqData = { status: { value: "Reject" } };
        await dispatch(filterApplicationListByUser(1, reqData));

        break;
      case "All":
        reqData = { status: { value: "All" } };
        await dispatch(getApplicationListByUser(1));
        break;
    }
  };

  return (
    <div className="app-user-list">
      <Row>
        <Col lg="3" sm="6">
          <StatsHorizontal
            onCardClick={() => handleClick("All")}
            color="primary"
            className={`card-hover ${type === "All" ? "active" : ""}`}
            statTitle="Total Applicants"
            icon={<User size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">{countObj?.total_count}</h3>
            }
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            onCardClick={() => handleClick("Approved")}
            color="success"
            className={`card-hover ${type === "Approved" ? "active" : ""}`}
            statTitle="Approved Application"
            icon={<UserCheck size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">{countObj?.approved_count}</h3>
            }
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            onCardClick={() => handleClick("Rejected")}
            color="danger"
            className={`card-hover ${type === "Rejected" ? "active" : ""}`}
            statTitle="Rejected Application"
            icon={<UserX size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">{countObj?.rejected_count}</h3>
            }
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="warning"
            className="card-hover"
            statTitle="Pending Application"
            icon={<UserPlus size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">{countObj?.pending_count}</h3>
            }
          />
        </Col>
      </Row>
      <Table />
    </div>
  );
};

export default UsersList;
