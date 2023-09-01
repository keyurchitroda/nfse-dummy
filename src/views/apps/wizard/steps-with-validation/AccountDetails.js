// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Utils
import { isObjEmpty, selectThemeColors } from "@utils";

import Select from "react-select";

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
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFormValueOnUnmout,
  createApplicationForm,
  editApplicationForm,
  getDistrictList,
  getSingleApplicationList,
  getTalukaList,
  getZonelOfficerList,
  getZonesList,
} from "../../../../redux/slices/appformSlice";
import _ from "lodash";
import { getProfileValues } from "../../../../redux/slices/dashboardSlice";
import ComponentSpinner from "../../../../@core/components/spinner/Loading-spinner";

const countryOptions = [
  { value: "UK", label: "UK" },
  { value: "USA", label: "USA" },
  { value: "Spain", label: "Spain" },
  { value: "France", label: "France" },
  { value: "Italy", label: "Italy" },
  { value: "Australia", label: "Australia" },
];

const AccountDetails = ({ stepper }) => {
  const formDetails = useSelector((state) => state.appformSlice);
  const SignupSchema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    middlename: yup.string().required(),
    rationcard: yup.string().required(),
    address: yup.string().required(),
    district: yup.object().shape({
      value: yup.string().nullable().required("Please select a District"),
    }),
    taluka: yup.object().shape({
      value: yup.string().nullable().required("Please select a Taluka"),
    }),
    zone: yup.object().shape({
      value: yup.string().nullable().required("Please select a Zone"),
    }),
    zonalOfficer: yup.object().shape({
      value: yup.string().nullable().required("Please select a zonalOfficer"),
    }),
  });

  const defaultValues = {
    rationcard: _.get(formDetails, "singleApplication.rationcard_number", "")
      ? _.get(formDetails, "singleApplication.rationcard_number", "")
      : "",
    firstname: _.get(formDetails, "singleApplication.firstname", "")
      ? _.get(formDetails, "singleApplication.firstname", "")
      : "",
    middlename: _.get(formDetails, "singleApplication.middlename", "")
      ? _.get(formDetails, "singleApplication.middlename", "")
      : "",
    lastname: _.get(formDetails, "singleApplication.lastname", "")
      ? _.get(formDetails, "singleApplication.lastname", "")
      : "",
    address: _.get(formDetails, "singleApplication.address", "")
      ? _.get(formDetails, "singleApplication.address", "")
      : "",
    district: _.get(formDetails, "singleApplication.district", "")
      ? _.get(formDetails, "singleApplication.district", "")
      : "",
    taluka: _.get(formDetails, "singleApplication.taluka", "")
      ? _.get(formDetails, "singleApplication.taluka", "")
      : "",
    zone: _.get(formDetails, "singleApplication.zone", "")
      ? _.get(formDetails, "singleApplication.zone", "")
      : "",
    zonalOfficer: _.get(formDetails, "singleApplication.zonal_manager", "")
      ? _.get(formDetails, "singleApplication.zonal_manager", "")
      : "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    if (isObjEmpty(errors)) {
      let reqData = {
        firstname: _.get(data, "firstname", ""),
        middlename: _.get(data, "middlename", ""),
        lastname: _.get(data, "lastname", ""),
        rationcard_number: _.get(data, "rationcard", ""),
        address: _.get(data, "address", ""),
        district: _.get(data, "district.value", ""),
        taluka: _.get(data, "taluka.value", ""),
        zone: _.get(data, "zone.value", ""),
        zonal_manager: _.get(data, "zonalOfficer.value", ""),
      };
      if (_.get(formDetails, "createAppForm.id", "")) {
        await dispatch(
          editApplicationForm(
            reqData,
            stepper,
            false,
            "",
            _.get(formDetails, "createAppForm.id", "")
          )
        );
      } else {
        await dispatch(createApplicationForm(reqData, stepper));
      }
    }
  };

  const dispatch = useDispatch();
  const [dataFetched, setDataFetched] = useState(false);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(_.get(formDetails, "singleApplication", "")).length === 0) {
      setIsProfileDataLoading(true);
      getProfileData();
    }
  }, []);

  const getProfileData = async () => {
    await dispatch(getProfileValues());
    setDataFetched(true);
  };

  useEffect(() => {
    if (dataFetched) {
      getDistrictTalukaZoneValues();
      setValue(
        "firstname",
        _.get(formDetails, "singleApplication.firstname", "")
      );
      setValue(
        "lastname",
        _.get(formDetails, "singleApplication.lastname", "")
      );
      setValue(
        "middlename",
        _.get(formDetails, "singleApplication.middlename", "")
      );
      setValue("address", _.get(formDetails, "singleApplication.address", ""));
      setValue("district", {
        value: _.get(formDetails, "singleApplication.district.id", ""),
        label: _.get(formDetails, "singleApplication.district.name", ""),
      });
      setValue("taluka", {
        value: _.get(formDetails, "singleApplication.taluka.id", ""),
        label: _.get(formDetails, "singleApplication.taluka.name", ""),
      });
      setValue("zone", {
        value: _.get(formDetails, "singleApplication.zone.id", ""),
        label: _.get(formDetails, "singleApplication.zone.name", ""),
      });
      setIsProfileDataLoading(false);
    }
  }, [dataFetched]);

  useEffect(() => {
    return () => {
      dispatch(clearFormValueOnUnmout());
    };
  }, []);

  useEffect(() => {
    dispatch(getDistrictList());
    if (Object.keys(_.get(formDetails, "singleApplication", "")).length !== 0) {
      getDistrictTalukaZoneValues();
    }
  }, []);

  const handleDistrictChange = async (selectedOption) => {
    setValue("district", selectedOption);
    trigger("district");
    await dispatch(getTalukaList(_.get(selectedOption, "value", "")));
  };

  const handleTalukaChange = async (selectedOption) => {
    setValue("taluka", selectedOption);
    trigger("taluka");
    await dispatch(getZonesList(_.get(selectedOption, "value", "")));
  };

  const handleZoneChange = async (selectedOption) => {
    setValue("zone", selectedOption);
    trigger("zone");
    await dispatch(getZonelOfficerList(_.get(selectedOption, "value", "")));
  };

  const objDist = {
    value: _.get(formDetails, "singleApplication.district.id", ""),
    label: _.get(formDetails, "singleApplication.district.name", ""),
  };

  const objTaluka = {
    value: _.get(formDetails, "singleApplication.taluka.id", ""),
    label: _.get(formDetails, "singleApplication.taluka.name", ""),
  };

  const objZone = {
    value: _.get(formDetails, "singleApplication.zone.id", ""),
    label: _.get(formDetails, "singleApplication.zone.name", ""),
  };

  const objZonalOfficer = {
    value: _.get(formDetails, "singleApplication.zonal_manager.id", ""),
    label: `${_.get(
      formDetails,
      "singleApplication.zonal_manager.firstname",
      ""
    )} ${_.get(
      formDetails,
      "singleApplication.zonal_manager.middlename",
      ""
    )} ${_.get(formDetails, "singleApplication.zonal_manager.lastname", "")}`,
  };

  useEffect(() => {
    if (Object.keys(_.get(formDetails, "singleApplication", "")).length !== 0) {
      setValue("district", objDist);
      setValue("taluka", objTaluka);
      setValue("zone", objZone);
      setValue("zonalOfficer", objZonalOfficer);
    }
  }, [setValue]);

  const getDistrictTalukaZoneValues = async () => {
    await dispatch(
      getTalukaList(_.get(formDetails, "singleApplication.district.id", ""))
    );
    await dispatch(
      getZonesList(_.get(formDetails, "singleApplication.taluka.id", ""))
    );
    await dispatch(
      getZonelOfficerList(_.get(formDetails, "singleApplication.zone.id", ""))
    );
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Account Details</h5>
        <small className="text-muted">Enter Your Account Details.</small>
      </div>
      {isProfileDataLoading ? (
        <ComponentSpinner className="my-2" />
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="4" className="mb-2">
              <Label className="form-label" for="firstname">
                Applicant First Name (અરજદાર નું નામ)
              </Label>
              <Controller
                id="firstname"
                name="firstname"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="johndoe"
                    invalid={errors.firstname && true}
                    {...field}
                  />
                )}
              />
              {errors.firstname && (
                <FormFeedback>{errors.firstname.message}</FormFeedback>
              )}
            </Col>
            <Col md="4" className="mb-2">
              <Label className="form-label" for="middlename">
                Applicant Middle Name (અરજદાર નું નામ)
              </Label>
              <Controller
                id="middlename"
                name="middlename"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="johndoe"
                    invalid={errors.middlename && true}
                    {...field}
                  />
                )}
              />
              {errors.middlename && (
                <FormFeedback>{errors.middlename.message}</FormFeedback>
              )}
            </Col>
            <Col md="4" className="mb-2">
              <Label className="form-label" for="lastname">
                Applicant Last Name (અરજદાર નું નામ)
              </Label>
              <Controller
                id="lastname"
                name="lastname"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="johndoe"
                    invalid={errors.lastname && true}
                    {...field}
                  />
                )}
              />
              {errors.lastname && (
                <FormFeedback>{errors.lastname.message}</FormFeedback>
              )}
            </Col>
          </Row>
          <Row>
            <Col md="6" className="mb-2">
              <Label className="form-label" for={`rationcard`}>
                Ration card No. (રેશનકાર્ડ નં.)
              </Label>
              <Controller
                control={control}
                id="rationcard"
                name="rationcard"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="77896 96321"
                    invalid={errors.rationcard && true}
                    {...field}
                  />
                )}
              />
              {errors.rationcard && (
                <FormFeedback>{errors.rationcard.message}</FormFeedback>
              )}
            </Col>
            <div className="form-password-toggle col-md-6 mb-2">
              <Label className="form-label" for="address">
                Address (સરનામું)
              </Label>
              <Controller
                id="address"
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Mig77,khbclny,6thmn,6thcrs,basave79, Basaveshwaranagar"
                    invalid={errors.address && true}
                    {...field}
                  />
                )}
              />
              {errors.address && (
                <FormFeedback>{errors.address.message}</FormFeedback>
              )}
            </div>
          </Row>
          <Row>
            <Col md="3" className="mb-2">
              <Label className="form-label" for="district">
                District (જિલ્લો)
              </Label>
              <Controller
                control={control}
                name="district"
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`district`}
                      className={`react-select ${
                        errors.district ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={_.get(formDetails, "districts", [])}
                      onChange={handleDistrictChange}
                      defaultValue={objDist}
                    />
                    {errors.district && (
                      <div className="invalid-feedback">
                        district is a required field
                      </div>
                    )}
                  </div>
                )}
              />
            </Col>
            <Col md="3" className="mb-2">
              <Label className="form-label" for="taluka">
                Taluka (તાલુકો)
              </Label>
              <Controller
                control={control}
                name="taluka"
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`taluka`}
                      className={`react-select ${
                        errors.taluka ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={_.get(formDetails, "talukas", [])}
                      onChange={handleTalukaChange}
                      defaultValue={objTaluka}
                    />
                    {errors.taluka && (
                      <div className="invalid-feedback">
                        taluka is a required field
                      </div>
                    )}
                  </div>
                )}
              />
            </Col>
            <Col md="3" className="mb-2">
              <Label className="form-label" for="zone">
                Zone (વિસ્તાર)
              </Label>
              <Controller
                control={control}
                name="zone"
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`zone`}
                      className={`react-select ${
                        errors.zone ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={_.get(formDetails, "zones", [])}
                      onChange={handleZoneChange}
                      defaultValue={objZone}
                    />
                    {errors.zone && (
                      <div className="invalid-feedback">
                        zone is a required field
                      </div>
                    )}
                  </div>
                )}
              />
            </Col>
            <Col md="3" className="mb-2">
              <Label className="form-label" for="zonalOfficer">
                Zonal Officer (ઝોનલ ઓફિસર)
              </Label>
              <Controller
                control={control}
                name="zonalOfficer"
                render={({ field }) => (
                  <div>
                    <Select
                      {...field}
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`zonalOfficer`}
                      className={`react-select ${
                        errors.zonalOfficer ? "is-invalid" : ""
                      }`}
                      classNamePrefix="select"
                      options={_.get(formDetails, "zonelOfficers", [])}
                      defaultValue={objZonalOfficer}
                    />
                    {errors.zonalOfficer && (
                      <div className="invalid-feedback">
                        zone is a required field
                      </div>
                    )}
                  </div>
                )}
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-between my-1">
            <Button color="secondary" className="btn-prev" outline disabled>
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
              disabled={formDetails.isFormLoading}
            >
              <span className="align-middle me-50">
                Next
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
      )}
    </Fragment>
  );
};

export default AccountDetails;
