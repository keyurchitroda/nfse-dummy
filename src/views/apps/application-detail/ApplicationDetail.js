import { useState, Fragment, useEffect } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  FormFeedback,
  Spinner,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import {
  getApproveReason,
  getRejectReason,
  updateApplicationStatus,
} from "../../../redux/slices/dashboardSlice";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const ApplicationDetail = () => {
  const applicationDetail = useSelector(
    (state) => state.dashboardSlice.applicationDetails
  );
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const isLoading = useSelector((state) => state.dashboardSlice.isLoading);
  const isFormLoading = useSelector(
    (state) => state.dashboardSlice.isFormLoading
  );
  const reasons = useSelector((state) => state.dashboardSlice);
  const user = useSelector((state) => state.authReducer.user_details);

  const [submitModal, setSubmitModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [applicationUrl, setApplicationUrl] = useState("");
  const [fileExeUrl, setFileExeUrl] = useState("");

  useEffect(() => {
    const extension = applicationUrl.split(".").pop();
    return setFileExeUrl(extension);
  }, [applicationUrl]);

  const reasonOptions = [
    { value: 1, label: "All Proof Wrong" },
    { value: 2, label: "Aadhar Card Wrong" },
    { value: 3, label: "Income Certificate Wrong" },
    {
      value: 4,
      label: "Disability Certificate Wrong",
    },
    { value: 5, label: "Light Bill Wrong" },
    { value: 6, label: "Rent Agreement Wrong" },
    { value: 7, label: "Other" },
  ];

  const [selectReason, setSelectReason] = useState([]);
  const [selectApproveReason, setSelectApproveReason] = useState([]);

  const [error, setError] = useState("");
  const [remark, setRemark] = useState("");

  const [roleCheck, setroleCheck] = useState({});

  const checkRole = (detail) => {
    let obj = {
      role: false,
      approveReject: false,
    };

    switch (true) {
      case user?.role === "User":
        obj.role = false;
        obj.approveReject = false;
        break;
      case user?.role === "Mamlatdar":
        obj.role = true;

        if (
          detail.zonal_officer_rejected === false &&
          detail.deputy_mamlatdar_rejected === false
        ) {
          obj.approveReject = true;
        } else if (
          detail.mamlatdar_approval === true ||
          detail.mamlatdar_rejected === true
        ) {
          obj.approveReject = true;
        } else {
          obj.approveReject = false;
        }
        break;
      case user?.role === "Zonal Officer":
        obj.role = true;
        if (
          detail.zonal_officer_approval === true ||
          detail.zonal_officer_rejected === true
        ) {
          obj.approveReject = true;
        } else {
          obj.approveReject = false;
        }
        break;
      case user?.role === "Deputy Mamlatdar":
        obj.role = true;
        if (
          detail.zonal_officer_approval === false
          // &&
          // detail.zonal_officer_rejected === false
        ) {
          obj.approveReject = true;
        } else if (
          detail.deputy_mamlatdar_approval === true ||
          detail.deputy_mamlatdar_rejected === true
        ) {
          obj.approveReject = true;
        } else {
          obj.approveReject = false;
        }
        break;
      default:
    }
    setroleCheck(obj);
  };

  useEffect(() => {
    dispatch(getRejectReason());
    dispatch(getApproveReason());
    checkRole(applicationDetail);
  }, [applicationDetail]);

  const onSubmitReason = async () => {
    const newReasonArr = selectReason.map((item) => item.value);
    if (selectReason.length > 0) {
      setError("");
      const reqData = {
        status: "Reject",
        reasons: newReasonArr,
        remarks: remark,
      };
      await dispatch(updateApplicationStatus(applicationDetail.id, reqData));
      if (!isLoading) {
        setSelectReason([]);
        setRemark("");
        // navigation("/dashboard");
        window.location.href = "/dashboard";
        setRejectModal(!rejectModal);
      }
    } else {
      setError("Please select reason for reject application");
    }
  };

  const onSubmitApprove = async () => {
    const newApproveReasonArr = selectApproveReason.map((item) => item.value);
    if (selectApproveReason.length > 0) {
      setError("");
      const reqData = {
        status: "Approve",
        reasons: newApproveReasonArr,
        remarks: remark,
      };
      await dispatch(updateApplicationStatus(applicationDetail.id, reqData));
      if (!isLoading) {
        setSelectApproveReason([]);
        setRemark("");
        // navigation("/dashboard");
        window.location.href = "/dashboard";
        setSubmitModal(!submitModal);
      }
    } else {
      setError("Please select reason for reject application");
    }
  };

  return (
    <Fragment>
      <Card className="application-detail">
        {isLoading ? (
          <ComponentSpinner className="my-2" />
        ) : (
          <CardBody>
            <Row>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="fullname">
                  <strong>Applicant Name (અરજદાર નું નામ)</strong>
                </Label>
                <Input
                  type="text"
                  name="fullname"
                  value={`${applicationDetail.firstname} ${applicationDetail.middlename} ${applicationDetail.lastname}`}
                  readOnly
                />
              </Col>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="rationcard">
                  <strong>Ration card No. (રેશનકાર્ડ નં.)</strong>
                </Label>
                <Input
                  type="text"
                  name="rationcard"
                  value={applicationDetail.rationcard_number}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" className="mb-2">
                <Label className="form-label" for="address">
                  <strong>Address (સરનામું)</strong>
                </Label>
                <Input
                  type="text"
                  name="address"
                  value={applicationDetail.address}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col md="3" className="mb-2">
                <Label className="form-label" for="district">
                  <strong>District (જિલ્લો)</strong>
                </Label>
                <Input
                  type="text"
                  name="district"
                  value={applicationDetail?.district?.name}
                  readOnly
                />
              </Col>
              <Col md="3" className="mb-2">
                <Label className="form-label" for="taluka">
                  <strong>Taluka (તાલુકો)</strong>
                </Label>
                <Input
                  type="text"
                  name="taluka"
                  value={applicationDetail?.taluka?.name}
                  readOnly
                />
              </Col>
              <Col md="3" className="mb-2">
                <Label className="form-label" for="zone">
                  <strong>Zone (વિસ્તાર)</strong>
                </Label>
                <Input
                  type="text"
                  name="zone"
                  value={applicationDetail?.zone?.name}
                  readOnly
                />
              </Col>
              <Col md="3" className="mb-2">
                <Label className="form-label" for="zonalOfficer">
                  <strong>Zonal Officer (ઝોનલ ઓફિસર)</strong>
                </Label>
                <Input
                  type="text"
                  name="zonalOfficer"
                  value={`${applicationDetail?.zonal_manager?.firstname} ${applicationDetail?.zonal_manager?.middlename} ${applicationDetail?.zonal_manager?.lastname}`}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="aadharCard">
                  <strong>Aadhar Card No. (આધાર કાર્ડ નં.)</strong>
                </Label>
                <Input
                  type="text"
                  name="aadharCard"
                  value={applicationDetail.adharcard_number}
                  readOnly
                />
              </Col>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="annualIncome">
                  <strong>
                    Annual Income of Family (કુટુંબની વાર્ષિક આવક)
                  </strong>
                </Label>
                <Input
                  type="text"
                  name="annualIncome"
                  value={applicationDetail.annual_income}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="disabilities">
                  <strong>Any Disabilities? (દિવ્યાંગતા ધરવો ચો?)</strong>
                </Label>
                <Input
                  type="text"
                  name="disabilities"
                  value={applicationDetail.any_disabilites}
                  readOnly
                />
              </Col>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="disability">
                  <strong>
                    How much disability % you have? (તમે કેટલા % દિવ્યાંગતા
                    ધારવો છો?)
                  </strong>
                </Label>
                <Input
                  type="text"
                  name="disability"
                  value={applicationDetail.disability_percentage}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="vidhvaPension">
                  <strong>
                    Is anyone in your family avialing the benefits of Vidhva
                    Pension? (શું તમારા કુટુંબમાં વિધવા પેન્શન ચાલુ છે?)
                  </strong>
                </Label>
                <Input
                  type="text"
                  name="vidhvaPension"
                  value={applicationDetail.is_vidhvapension_available}
                  readOnly
                />
              </Col>
              <Col md="6" className="mb-2">
                <Label className="form-label" for="vrudhSahay">
                  <strong>
                    Are you availing benefits of Niradhar Vrudh Sahay? (નિરાધર
                    વૃધ્ધ સહાય મેલવો છો?)
                  </strong>
                </Label>
                <Input
                  type="text"
                  name="vrudhSahay"
                  value={applicationDetail.is_nvs_available}
                  readOnly
                />
              </Col>
            </Row>
            <p className="mt-1">
              <b className="text-decoration-underline">Proof</b>
            </p>
            <Row>
              <Col md="6" className="mb-md-2">
                <Label className="form-label" for="vidhvaPension">
                  <strong>
                    Upload Your Aadhar Card. (તમારું આધાર કાર્ડ અપલોડ કરો)
                  </strong>
                </Label>
              </Col>
              <Col
                md="6"
                className="mb-2 text-md-end"
                onClick={() => {
                  setImageModal(true);
                  setApplicationUrl(applicationDetail.adharcard_upload);
                }}
              >
                <span
                  className="text-dark text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  Aadharcard
                </span>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-md-2">
                <Label className="form-label" for="vidhvaPension">
                  <strong>Income Certificate (આવકનું પ્રમાણપત્ર)</strong>
                </Label>
              </Col>
              <Col
                md="6"
                className="mb-2 text-md-end"
                onClick={() => {
                  setImageModal(true);
                  setApplicationUrl(applicationDetail.incomecerty_upload);
                }}
              >
                <span
                  className="text-dark text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  Income-Certificate
                </span>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-md-2">
                <Label className="form-label" for="vidhvaPension">
                  <strong>
                    Disability Certificate (દિવ્યાંગતા પ્રમાણપત્ર)
                  </strong>
                </Label>
              </Col>
              <Col
                md="6"
                className="mb-2 text-md-end"
                onClick={() => {
                  setImageModal(true);
                  setApplicationUrl(applicationDetail.incomecerty_upload);
                }}
              >
                <span
                  className="text-dark text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  Disability-Certificate
                </span>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-md-2">
                <Label className="form-label" for="vidhvaPension">
                  <strong>Light Bill (લાઇટ બિલ)</strong>
                </Label>
              </Col>
              <Col
                md="6"
                className="mb-2 text-md-end"
                onClick={() => {
                  setImageModal(true);
                  setApplicationUrl(applicationDetail.lightbill);
                }}
              >
                <span
                  className="text-dark text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  Light-Bill
                </span>
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mb-md-2">
                <Label className="form-label" for="vidhvaPension">
                  <strong>Rent Agreement (ભાડા કરાર)</strong>
                </Label>
              </Col>
              <Col
                md="6"
                className="mb-2 text-md-end"
                onClick={() => {
                  setImageModal(true);
                  setApplicationUrl(applicationDetail.rentagreement);
                }}
              >
                <span
                  className="text-dark text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  Rent-Agreement
                </span>
              </Col>
            </Row>
            {roleCheck?.role && !roleCheck?.approveReject ? (
              <>
                <Row>
                  <Col md="12" className="my-2 d-flex justify-content-end">
                    <Button.Ripple
                      color="danger"
                      onClick={() => setRejectModal(true)}
                    >
                      Reject
                    </Button.Ripple>
                    <Button.Ripple
                      color="success"
                      className="ms-2"
                      onClick={() => setSubmitModal(true)}
                    >
                      Approve
                    </Button.Ripple>
                  </Col>
                </Row>
              </>
            ) : null}
          </CardBody>
        )}
      </Card>

      {/* Submit modal */}
      <Modal
        isOpen={submitModal}
        toggle={() => setSubmitModal(!submitModal)}
        className="modal-dialog-centered"
        backdrop={false}
        keyboard={false}
      >
        <ModalBody className="my-2">
          <h4 className="text-center mb-2">
            Are you sure you want Approve This Application?
          </h4>
          <Row>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="reason">
                Select Approve Reason
              </Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                isMulti
                name="colors"
                options={reasons.approveReason}
                className="react-select"
                classNamePrefix="select"
                onChange={(e) => setSelectApproveReason(e)}
              />
              {<div style={{ color: "red" }}>{error}</div>}
            </Col>
          </Row>
          <Row>
            <Col md="12" className="mb-1">
              <Label>Remark</Label>
              <Input
                type="textarea"
                name="text"
                id="exampleText"
                rows="3"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setSubmitModal(!submitModal)}
          >
            No
          </Button>{" "}
          <Button
            color="primary"
            onClick={() => onSubmitApprove()}
            disabled={isFormLoading}
          >
            <span className="align-middle me-50">Yes</span>
            {isFormLoading ? (
              <Spinner
                color="white"
                className="align-middle ms-sm-25 ms-0"
                size="sm"
              />
            ) : null}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject modal */}
      <Modal
        isOpen={rejectModal}
        toggle={() => setRejectModal(!rejectModal)}
        className="modal-dialog-centered"
        backdrop={false}
        keyboard={false}
      >
        <ModalBody className="mt-2">
          <h4 className="text-center mb-2">
            Are you sure you want Reject This Application?
          </h4>
          <Row>
            <Col md="12" className="mb-1">
              <Label className="form-label" for="reason">
                Select Reason
              </Label>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                isMulti
                name="colors"
                options={reasons.rejectReason}
                className="react-select"
                classNamePrefix="select"
                value={selectReason}
                onChange={(e) => setSelectReason(e)}
              />
              {<div style={{ color: "red" }}>{error}</div>}
            </Col>
          </Row>
          <Row>
            <Col md="12" className="mb-1">
              <Label>Remark</Label>
              <Input
                type="textarea"
                name="text"
                id="exampleText"
                rows="3"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setRejectModal(!rejectModal)}
          >
            No
          </Button>{" "}
          <Button
            color="primary"
            onClick={() => onSubmitReason()}
            disabled={isFormLoading}
          >
            <span className="align-middle me-50">Yes</span>
            {isFormLoading ? (
              <Spinner
                color="white"
                className="align-middle ms-sm-25 ms-0"
                size="sm"
              />
            ) : null}
          </Button>
          {/* <Button color="primary" onClick={() => onSubmitReason()}>
            Yes
          </Button> */}
        </ModalFooter>
      </Modal>

      {/* Image modal */}
      <Modal
        isOpen={imageModal}
        toggle={() => setImageModal(!imageModal)}
        className="modal-dialog-centered"
      >
        <ModalBody className="mt-2">
          {fileExeUrl == "jpg" ||
          fileExeUrl == "png" ||
          fileExeUrl == "jpeg" ? (
            <img src={applicationUrl} width="100%" height="100%"></img>
          ) : (
            <iframe
              src={applicationUrl}
              width="100%"
              height="500px"
              frameborder="0"
            ></iframe>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setImageModal(!imageModal)}>
            Close
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};
export default ApplicationDetail;
