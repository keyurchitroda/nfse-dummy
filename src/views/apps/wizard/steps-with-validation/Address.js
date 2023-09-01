import { Fragment, useEffect, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, PlusCircle } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardText,
  ModalFooter,
} from "reactstrap";
import {
  CloseModal,
  createApplicationForm,
  displayImageOrPdfUrl,
  editApplicationForm,
} from "../../../../redux/slices/appformSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const Address = ({ stepper }) => {
  const formDetails = useSelector((state) => state.appformSlice);

  const [imageModal, setImageModal] = useState(false);
  const [applicationUrl, setApplicationUrl] = useState("");
  const [fileExeUrl, setFileExeUrl] = useState("");

  const getFile = async (blobUrlOrFile) => {
    try {
      if (blobUrlOrFile instanceof File) {
        // If the input is already a File object, return it as is
        return blobUrlOrFile;
      } else {
        // If the input is a URL, fetch the image and create a File object
        const response = await fetch(blobUrlOrFile);
        const blobData = await response.blob();
        const filename = blobUrlOrFile.split("/").pop();

        const file = new File([blobData], filename, { type: blobData.type });
        return file;
      }
    } catch (error) {
      console.error("Error fetching Blob data:", error);
      throw error;
    }
  };

  const defaultValues = {
    vidhvaPension: _.get(
      formDetails,
      "singleApplication.is_vidhvapension_available",
      ""
    ),
    vrudhSahay: _.get(formDetails, "singleApplication.is_nvs_available", ""),
    lightBill: _.get(formDetails, "singleApplication.lightbill", ""),
    rentAgreement: _.get(formDetails, "singleApplication.rentagreement", ""),
    conditions: _.get(formDetails, "singleApplication.terms_accepted", "")
      ? _.get(formDetails, "singleApplication.terms_accepted", "")
      : false,
  };

  const InfoSchema = yup.object().shape({
    vidhvaPension: yup.string().required(),
    vrudhSahay: yup.string().required(),
    conditions: yup
      .boolean()
      .oneOf([true], "Please accept the terms & conditions."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(InfoSchema),
  });

  let vidhvaPensionValue = watch("vidhvaPension");
  let vrudhSahayValue = watch("vrudhSahay");
  let lightBillWatch = watch("lightBill");
  let rentAgreementWatch = watch("rentAgreement");

  const isImageUpload = () => {
    let isUploaded = false;
    if (lightBillWatch && rentAgreementWatch) {
      isUploaded = true;
    }
    return isUploaded;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (data) => {
    if (isObjEmpty(errors)) {
      const formData = new FormData();
      const lightBillUpload = await getFile(_.get(data, "lightBill", ""));
      const rentAgreementUpload = await getFile(
        _.get(data, "rentAgreement", "")
      );
      formData.append(
        "is_vidhvapension_available",
        _.get(data, "vidhvaPension", "")
      );
      formData.append("is_nvs_available", _.get(data, "vrudhSahay", ""));
      formData.append("lightbill", lightBillUpload);
      formData.append("rentagreement", rentAgreementUpload);
      formData.append("terms_accepted", _.get(data, "conditions", ""));

      await dispatch(
        editApplicationForm(
          formData,
          stepper,
          true,
          navigate,
          _.get(formDetails, "createAppForm.id", "")
        )
      );
      setShowModal(true);
    }
  };

  const handleCloseModal = async () => {
    await dispatch(CloseModal());
    navigate("/draft");
  };

  const checkBlobType = async (url) => {
    // Check if the URL starts with "blob:" protocol
    if (url.startsWith("blob:")) {
      const response = await fetch(url);
      const blobData = await response.blob();

      // Determine the file type based on the blob's MIME type
      if (blobData.type.startsWith("image/")) {
        setFileExeUrl("image");
      } else if (blobData.type === "application/pdf") {
        setFileExeUrl("pdf");
      }
      setApplicationUrl(url);
    } else {
      const extension = url.split(".").pop();
      console.log("extension-=-=-", extension);
      if (extension === "pdf") {
        console.log("pdf url", url);
        setFileExeUrl("pdf");
      } else {
        console.log("image url", url);

        setFileExeUrl("image");
      }
      setApplicationUrl(url);
    }
  };

  const handleFileChange = async (selectedFile, name) => {
    if (selectedFile) {
      const blobUrl = URL.createObjectURL(selectedFile);
      await dispatch(displayImageOrPdfUrl(blobUrl, name));
    }
  };

  const isDisbaled = isImageUpload() ? false : true;

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Account Details</h5>
        <small className="text-muted">Enter Your Account Details.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="7" className="mb-2">
            <Label className="form-label" for="vidhvaPension">
              Is anyone in your family avialing the benefits of Vidhva Pension?
              (શું તમારા કુટુંબમાં વિધવા પેન્શન ચાલુ છે?)
            </Label>
          </Col>
          <Col md="5" className="mb-2 d-flex">
            <div className="form-check me-2">
              {/* <Input type='radio' id='ex3-active' name='ex3' defaultChecked /> */}
              {/* <Label className='form-check-label' for='ex3-active'>
                Yes
              </Label> */}
              <label className="form-check-label" htmlFor="ex3-active">
                <Controller
                  name="vidhvaPension"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="radio"
                      id="ex3-active"
                      value="Yes"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("vidhvaPension", "Yes"); // Set value to "Yes"
                      }}
                      checked={field.value === "Yes"} // Check condition
                      invalid={errors.vidhvaPension && true}
                    />
                  )}
                />
                Yes
              </label>
            </div>
            <div className="form-check">
              {/* <Input type="radio" name="ex3" id="ex3-inactive" />
              <Label className="form-check-label" for="ex3-inactive">
                No
              </Label> */}

              <label className="form-check-label" htmlFor="ex3-inactive">
                <Controller
                  name="vidhvaPension"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="radio"
                      id="ex3-inactive"
                      value="No"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("vidhvaPension", "No"); // Set value to "No"
                      }}
                      checked={field.value === "No"} // Check condition
                      invalid={errors.vidhvaPension && true}
                    />
                  )}
                />
                No
              </label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md="7" className="mb-2">
            <Label className="form-label" for="vrudhSahay">
              Are you availing benefits of Niradhar Vrudh Sahay? (નિરાધર વૃધ્ધ
              સહાય મેળવો છો?)
            </Label>
          </Col>
          <Col md="5" className="mb-2 d-flex">
            <div className="form-check me-2">
              <label className="form-check-label" htmlFor="ex4-active">
                <Controller
                  name="vrudhSahay"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="radio"
                      id="ex4-active"
                      value="Yes"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("vrudhSahay", "Yes"); // Set value to "Yes"
                      }}
                      checked={field.value === "Yes"} // Check condition
                      invalid={errors.vrudhSahay && true}
                    />
                  )}
                />
                Yes
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label" htmlFor="ex4-inactive">
                <Controller
                  name="vrudhSahay"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="radio"
                      id="ex4-inactive"
                      value="No"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("vrudhSahay", "No"); // Set value to "Yes"
                      }}
                      checked={field.value === "No"} // Check condition
                      invalid={errors.vrudhSahay && true}
                    />
                  )}
                />
                No
              </label>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="form-password-toggle col-md-6 mb-2">
            <div className="d-flex justify-content-between">
              <Label className="form-label" for="lightBill">
                Light Bill (લાઇટ બિલ)
              </Label>
              {formDetails.displayImageView.lightBill && (
                <a
                  className="text-primary ms-2"
                  onClick={() => {
                    setImageModal(true);
                    checkBlobType(formDetails.displayImageView.lightBill);
                  }}
                >
                  view
                </a>
              )}
            </div>
            <Controller
              id="lightBill"
              name="lightBill"
              control={control}
              render={({ field }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    style={{
                      border: ` ${
                        formDetails.displayImageView.lightBill
                          ? "2px solid #4caf50"
                          : "1px solid #ccc"
                      }`,
                    }}
                    type="file"
                    id="lightBill"
                    name="fileInput"
                    invalid={errors.lightBill && true}
                    onChange={(e) => {
                      const selectedFile2 = e.target.files[0];
                      setValue("lightBill", selectedFile2);
                      field.onChange(selectedFile2); // This is required by react-hook-form
                      handleFileChange(selectedFile2, "lightBill");
                    }}
                  />
                  {formDetails.displayImageView.lightBill && (
                    <span
                      style={{
                        color: ` ${
                          formDetails.displayImageView.lightBill && "#4caf50"
                        }`,
                        position: "relative",
                        right: "20px",
                      }}
                      className="right-icon"
                    >
                      &#10003;
                    </span>
                  )}
                </div>
              )}
            />
          </div>
          <div className="form-password-toggle col-md-6 mb-2">
            <div className="d-flex justify-content-between">
              <Label className="form-label" for="rentAgreement">
                Rent Agreement (ભાડા કરાર)
              </Label>
              {formDetails.displayImageView.rentAgreement && (
                <a
                  className="text-primary ms-2"
                  onClick={() => {
                    setImageModal(true);
                    checkBlobType(formDetails.displayImageView.rentAgreement);
                  }}
                >
                  view
                </a>
              )}
            </div>
            <Controller
              id="rentAgreement"
              name="rentAgreement"
              control={control}
              render={({ field }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    style={{
                      border: ` ${
                        formDetails.displayImageView.rentAgreement
                          ? "2px solid #4caf50"
                          : "1px solid #ccc"
                      }`,
                    }}
                    type="file"
                    id="rentAgreement"
                    name="fileInput"
                    invalid={errors.rentAgreement && true}
                    onChange={(e) => {
                      const selectedFile1 = e.target.files[0];
                      setValue("rentAgreement", selectedFile1);
                      field.onChange(selectedFile1); // This is required by react-hook-form
                      handleFileChange(selectedFile1, "rentAgreement");
                    }}
                  />
                  {formDetails.displayImageView.rentAgreement && (
                    <span
                      style={{
                        color: ` ${
                          formDetails.displayImageView.rentAgreement &&
                          "#4caf50"
                        }`,
                        position: "absolute",
                        right: "10px",
                      }}
                      className="right-icon"
                    >
                      &#10003;
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </Row>
        <Row>
          <Col md="6" className="mb-2">
            <div className="form-check form-check-inline">
              <Controller
                name="conditions"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Input
                    type="checkbox"
                    id="conditions"
                    {...field}
                    invalid={errors.conditions && true}
                    checked={field.value}
                  />
                )}
              />
              <Label for="conditions" className="form-check-label">
                I Accepting terms & conditions (હું નિયમો અને શરતો સ્વીકારું
                છું.)
              </Label>
              {errors.conditions && (
                <div className="invalid-feedback">
                  {errors.conditions.message}
                </div>
              )}
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-between my-1">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button
            type="submit"
            color="success"
            className="btn-next"
            // disabled={formDetails.isFormLoading}
            disabled={isDisbaled || formDetails.isFormLoading}
          >
            <span className="align-middle me-50">
              Submit
            </span>
            {formDetails.isFormLoading ? (
              <Spinner
                color="white"
                className="align-middle ms-sm-25 ms-0"
                size="sm"
              />
            ) : (
              <ArrowRight
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></ArrowRight>
            )}
          </Button>
        </div>
      </Form>

      {/* payment modal */}
      <Modal
        isOpen={formDetails.isModalOpen}
        toggle={handleCloseModal}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={handleCloseModal}
        ></ModalHeader>
        <ModalBody className="px-2">
          <div className="payment-type">
            <Card>
              <CardHeader className="flex-column align-items-start">
                <CardTitle tag="h4">Payment options</CardTitle>
                <CardText className="text-muted mt-25">
                  Be sure to click on correct payment option
                </CardText>
              </CardHeader>
              <CardBody>
                <h6 className="card-holder-name my-75">John Doe</h6>
                <div className="form-check mb-2">
                  <Input
                    defaultChecked
                    id="us-card"
                    type="radio"
                    name="paymentMethod"
                  />
                  <Label className="form-check-label" htmlFor="us-card">
                    US Unlocked Debit Card 12XX XXXX XXXX 0000
                  </Label>
                </div>
                <Row className="customer-cvv mt-1 row-cols-lg-auto">
                  <Col xs={3} className="d-flex align-items-center">
                    <Label className="mb-50" for="card-holder-cvv">
                      Enter CVV:
                    </Label>
                  </Col>
                  <Col xs={4} className="p-0">
                    <Input className="input-cvv mb-50" id="card-holder-cvv" />
                  </Col>
                  <Col xs={3}>
                    <Button className="btn-cvv mb-50" color="primary">
                      Continue
                    </Button>
                  </Col>
                </Row>
                <hr className="my-2" />
                <ul className="other-payment-options list-unstyled">
                  <li className="py-50">
                    <div className="form-check">
                      <Input
                        type="radio"
                        name="paymentMethod"
                        id="credit-card"
                      />
                      <Label className="form-label" for="credit-card">
                        Credit / Debit / ATM Card
                      </Label>
                    </div>
                  </li>
                  <li className="py-50">
                    <div className="form-check">
                      <Input
                        type="radio"
                        name="paymentMethod"
                        id="payment-net-banking"
                      />
                      <Label className="form-label" for="payment-net-banking">
                        Net Banking
                      </Label>
                    </div>
                  </li>
                  <li className="py-50">
                    <div className="form-check">
                      <Input
                        type="radio"
                        name="paymentMethod"
                        id="payment-emi"
                      />
                      <Label className="form-label" for="payment-emi">
                        EMI (Easy Installment)
                      </Label>
                    </div>
                  </li>
                  <li className="py-50">
                    <div className="form-check">
                      <Input
                        type="radio"
                        name="paymentMethod"
                        id="payment-cod"
                      />
                      <Label className="form-label" for="payment-cod">
                        Cash On Delivery
                      </Label>
                    </div>
                  </li>
                </ul>
                <hr className="my-2" />
                <div className="gift-card mb-25">
                  <CardText>
                    <PlusCircle className="me-50" size={21} />
                    <span className="align-middle">Add Gift Card</span>
                  </CardText>
                </div>
                <Col xs={3}>
                  <Button
                    onClick={() => handleCloseModal()}
                    className="btn-cvv mb-50"
                    color="primary"
                  >
                    Continue
                  </Button>
                </Col>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
      </Modal>

      {/* Image modal */}
      <Modal
        isOpen={imageModal}
        toggle={() => setImageModal(!imageModal)}
        className="modal-dialog-centered"
      >
        <ModalBody className="mt-2">
          {fileExeUrl == "image" ? (
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

export default Address;
