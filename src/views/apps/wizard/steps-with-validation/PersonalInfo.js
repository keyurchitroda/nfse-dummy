// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
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
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  createApplicationForm,
  displayImageOrPdfUrl,
  editApplicationForm,
} from "../../../../redux/slices/appformSlice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

const PersonalInfo = ({ stepper }) => {
  const [imageModal, setImageModal] = useState(false);
  const [applicationUrl, setApplicationUrl] = useState("");
  const [fileExeUrl, setFileExeUrl] = useState("");

  const formDetails = useSelector((state) => state.appformSlice);
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
    aadharCard: _.get(formDetails, "singleApplication.adharcard_number", "")
      ? _.get(formDetails, "singleApplication.adharcard_number", "")
      : "",
    uploadAadharCard: _.get(
      formDetails,
      "singleApplication.adharcard_upload",
      ""
    )
      ? _.get(formDetails, "singleApplication.adharcard_upload", "")
      : "",
    incomeCertificate: _.get(
      formDetails,
      "singleApplication.incomecerty_upload",
      ""
    )
      ? _.get(formDetails, "singleApplication.incomecerty_upload", "")
      : "",
    annualIncome: _.get(formDetails, "singleApplication.annual_income", "")
      ? _.get(formDetails, "singleApplication.annual_income", "")
      : "",
    disability: _.get(formDetails, "singleApplication.any_disabilites", "")
      ? _.get(formDetails, "singleApplication.any_disabilites", "")
      : "",
    disabilityPerc: _.get(
      formDetails,
      "singleApplication.disability_percentage",
      ""
    )
      ? _.get(formDetails, "singleApplication.disability_percentage", "")
      : "",
    disabilityCertificate: _.get(
      formDetails,
      "singleApplication.disabilitycerty_upload",
      ""
    )
      ? _.get(formDetails, "singleApplication.disabilitycerty_upload", "")
      : "",
  };
  const dispatch = useDispatch();

  const aadharRegex = /^\d{12}$/;

  const InfoSchema = yup.object().shape({
    aadharCard: yup
      .string()
      .matches(aadharRegex, "Aadhar card number must be a 12-digit number")
      .required(),
    // uploadAadharCard: yup.string().required(),
    // incomeCertificate: yup.string().required(),
    annualIncome: yup.string().required(),
    disability: yup.string().required(),
    disabilityPerc: yup.string().when("disability", {
      is: "Yes",
      then: yup.string().required("Please provide disability percentage"),
      otherwise: yup.string(), // No validation if disability is not "Yes"
    }),
    // disabilityCertificate: yup.string().when("disability", {
    //   is: "Yes",
    //   then: yup.string().required("Please provide disability certificate"),
    //   otherwise: yup.string(), // No validation if disability is not "Yes"
    // }),
  });

  // ** Hooks

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

  let selectedDisabilityValue = watch("disability");
  let uploadAadharCardWatch = watch("uploadAadharCard");
  let incomeCertificateWatch = watch("incomeCertificate");
  let disabilityCertificateWatch = watch("disabilityCertificate");
  let disabilityWatch = watch("disability");

  const isImageUpload = () => {
    let isUploaded = false;
    if (uploadAadharCardWatch && incomeCertificateWatch) {
      isUploaded = true;
      if (disabilityWatch === "Yes") {
        if (disabilityCertificateWatch) {
          isUploaded = true;
        } else {
          isUploaded = false;
        }
      }
    }
    return isUploaded;
  };

  const onSubmit = async (data) => {
    if (isObjEmpty(errors)) {
      const formData = new FormData();

      const adharUpload = await getFile(_.get(data, "uploadAadharCard", ""));
      const incomecertyUpload = await getFile(
        _.get(data, "incomeCertificate", "")
      );
      const disabilityCertificate = await getFile(
        _.get(data, "disabilityCertificate", "")
      );

      formData.append("adharcard_number", _.get(data, "aadharCard", ""));
      formData.append("adharcard_upload", adharUpload);
      formData.append("annual_income", _.get(data, "annualIncome", ""));
      formData.append("incomecerty_upload", incomecertyUpload);
      formData.append("any_disabilites", _.get(data, "disability", ""));
      formData.append(
        "disability_percentage",
        _.get(data, "disability", "") === "Yes"
          ? _.get(data, "disabilityPerc", "")
          : ""
      );
      formData.append(
        "disabilitycerty_upload",
        _.get(data, "disability", "") === "Yes" ? disabilityCertificate : ""
      );
      await dispatch(
        editApplicationForm(
          formData,
          stepper,
          false,
          "",
          _.get(formDetails, "createAppForm.id", "")
        )
      );
    }
  };

  const handleFileChange = async (selectedFile, name) => {
    if (selectedFile) {
      const blobUrl = URL.createObjectURL(selectedFile);
      await dispatch(displayImageOrPdfUrl(blobUrl, name));
    }
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

    // setFileExeUrl("");
  };

  const isDisbaled = isImageUpload() ? false : true;

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Account Details</h5>
        <small className="text-muted">Enter Your Account Details.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Row>
          <Col md="6" className="mb-2">
            <Label className="form-label" for="aadharCard">
              Aadhar Card No. (આધાર કાર્ડ નં.)
            </Label>
            <Controller
              id="aadharCard"
              name="aadharCard"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="5623 6598 8993"
                  invalid={errors.aadharCard && true}
                  {...field}
                />
              )}
            />
            {errors.aadharCard && (
              <FormFeedback>{errors.aadharCard.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-2">
            <div className="d-flex justify-content-between">
              <Label className="form-label" for={`uploadAadharCard`}>
                Upload Your Aadhar Card. (તમારું આધાર કાર્ડ અપલોડ કરો)
              </Label>
              {formDetails.displayImageView.uploadAadharCard && (
                <a
                  className="text-primary ms-2"
                  onClick={() => {
                    setImageModal(true);
                    checkBlobType(
                      formDetails.displayImageView.uploadAadharCard
                    );
                  }}
                >
                  view
                </a>
              )}
            </div>

            <Controller
              id="uploadAadharCard"
              name="uploadAadharCard"
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
                        formDetails.displayImageView.uploadAadharCard
                          ? "2px solid #4caf50"
                          : "1px solid #ccc"
                      }`,
                    }}
                    type="file"
                    id="uploadAadharCard"
                    name="fileInput"
                    invalid={errors.uploadAadharCard && true}
                    onChange={(e) => {
                      const selectedFile1 = e.target.files[0];
                      setValue("uploadAadharCard", selectedFile1);
                      field.onChange(selectedFile1); // This is required by react-hook-form
                      handleFileChange(selectedFile1, "uploadAadharCard");
                    }}
                  />
                  {formDetails.displayImageView.uploadAadharCard && (
                    <span
                      style={{
                        color: ` ${
                          formDetails.displayImageView.uploadAadharCard &&
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
            {errors.uploadAadharCard && (
              <FormFeedback>{errors.uploadAadharCard.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <div className="form-password-toggle col-md-6 mb-2">
            <Label className="form-label" for="annualIncome">
              Annual Income of Family (કુટુંબની વાર્ષિક આવક)
            </Label>
            <Controller
              id="annualIncome"
              name="annualIncome"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="1,00,000"
                  invalid={errors.annualIncome && true}
                  {...field}
                />
              )}
            />
            {errors.annualIncome && (
              <FormFeedback>{errors.annualIncome.message}</FormFeedback>
            )}
          </div>
          <div className="form-password-toggle col-md-6 mb-2">
            <div className="d-flex justify-content-between">
              <Label className="form-label" for="incomeCertificate">
                Income Certificate (આવકનું પ્રમાણપત્ર)
              </Label>
              {formDetails.displayImageView.incomeCertificate && (
                <a
                  className="text-primary ms-2"
                  onClick={() => {
                    setImageModal(true);
                    checkBlobType(
                      formDetails.displayImageView.incomeCertificate
                    );
                  }}
                >
                  view
                </a>
              )}
            </div>
            <Controller
              id="incomeCertificate"
              name="incomeCertificate"
              control={control}
              render={({ field }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Input
                    type="file"
                    style={{
                      border: ` ${
                        formDetails.displayImageView.incomeCertificate
                          ? "2px solid #4caf50"
                          : "1px solid #ccc"
                      }`,
                    }}
                    id="incomeCertificate"
                    name="fileInput"
                    invalid={errors.incomeCertificate && true}
                    onChange={(e) => {
                      const selectedFile2 = e.target.files[0];
                      setValue("incomeCertificate", selectedFile2);
                      field.onChange(selectedFile2); // This is required by react-hook-form
                      handleFileChange(selectedFile2, "incomeCertificate");
                    }}
                  />
                  {formDetails.displayImageView.incomeCertificate && (
                    <span
                      style={{
                        color: ` ${
                          formDetails.displayImageView.incomeCertificate &&
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
            {errors.incomeCertificate && (
              <FormFeedback>{errors.incomeCertificate.message}</FormFeedback>
            )}
          </div>
        </Row>
        <Row>
          <Col md="3" className="mb-2">
            <Label className="form-label" for="disability">
              Any Disabilities? (દિવ્યાંગતા ધરવો ચો?)
            </Label>
          </Col>
          <Col md="5" className="mb-2 d-flex">
            <div className="form-check me-2">
              <label className="form-check-label" htmlFor="ex1-active">
                <Controller
                  name="disability"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="radio"
                      id="ex1-active"
                      value="Yes"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("disability", "Yes"); // Set value to "Yes"
                      }}
                      checked={field.value === "Yes"} // Check condition
                      invalid={errors.disability && true}
                    />
                  )}
                />
                Yes
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label" htmlFor="ex1-inactive">
                <Controller
                  name="disability"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="radio"
                      id="ex1-inactive"
                      value="No"
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("disability", "No"); // Set value to "No"
                      }}
                      checked={field.value === "No"} // Check condition
                      invalid={errors.disability && true}
                    />
                  )}
                />
                No
              </label>
            </div>
          </Col>
        </Row>
        {selectedDisabilityValue === "Yes" && (
          <Row>
            <Col md="6" className="mb-2">
              <Label className="form-label" for="disabilityPerc">
                How much disability % you have? (તમે કેટલા % દિવ્યાંગતા ધારવો
                છો?)
              </Label>
              <Controller
                id="disabilityPerc"
                name="disabilityPerc"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="25%"
                    invalid={errors.disabilityPerc && true}
                    {...field}
                  />
                )}
              />
              {errors.disabilityPerc && (
                <FormFeedback>{errors.disabilityPerc.message}</FormFeedback>
              )}
            </Col>
            <Col md="6" className="mb-2">
              <div className="d-flex justify-content-between">
                <Label className="form-label" for="disabilityCertificate">
                  Disability Certificate (દિવ્યાંગતા પ્રમાણપત્ર)
                </Label>
                {formDetails.displayImageView.disabilityCertificate && (
                  <a
                    className="text-primary ms-2"
                    onClick={() => {
                      setImageModal(true);
                      checkBlobType(
                        formDetails.displayImageView.disabilityCertificate
                      );
                    }}
                  >
                    view
                  </a>
                )}
              </div>
              <Controller
                id="disabilityCertificate"
                name="disabilityCertificate"
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
                          formDetails.displayImageView.disabilityCertificate
                            ? "2px solid #4caf50"
                            : "1px solid #ccc"
                        }`,
                      }}
                      type="file"
                      id="disabilityCertificate"
                      name="fileInput"
                      invalid={errors.disabilityCertificate && true}
                      onChange={(e) => {
                        const selectedFile4 = e.target.files[0];
                        setValue("disabilityCertificate", selectedFile4);
                        field.onChange(selectedFile4); // This is required by react-hook-form
                        handleFileChange(
                          selectedFile4,
                          "disabilityCertificate"
                        );
                      }}
                    />
                    {formDetails.displayImageView.disabilityCertificate && (
                      <span
                        style={{
                          color: ` ${
                            formDetails.displayImageView
                              .disabilityCertificate && "#4caf50"
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
              {errors.disabilityCertificate && (
                <FormFeedback>
                  {errors.disabilityCertificate.message}
                </FormFeedback>
              )}
            </Col>
          </Row>
        )}
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
            color="primary"
            className="btn-next"
            disabled={isDisbaled || formDetails.isFormLoading}
            // disabled={isImageUpload() ? false : true}
          >
            <span className="align-middle me-50">Next</span>
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

export default PersonalInfo;
