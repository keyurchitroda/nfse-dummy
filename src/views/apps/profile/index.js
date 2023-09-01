// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import axios from "axios";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";

// ** Demo Components
import Breadcrumbs from "@components/breadcrumbs";
import Profile from "./Profile";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [data, setData] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    axios
      .get("/account-setting/data")
      .then((response) => setData(response.data));
  }, []);

  return (
    <Fragment>
      <Breadcrumbs title="Profile" data={[{ title: "Profile" }]} />
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Profile data={data.general} />
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
};

export default AccountSettings;
