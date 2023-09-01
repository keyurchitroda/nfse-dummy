// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import Select from "react-select";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.us";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Spinner,
} from "reactstrap";

// ** Utils
import { selectThemeColors } from "@utils";
import {
  getDistrictList,
  getTalukaList,
  getZonelOfficerList,
  getZonesList,
} from "../../../redux/slices/appformSlice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  getProfileValues,
  updateProfileValues,
} from "../../../redux/slices/dashboardSlice";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";

const countryOptions = [
  { value: "zonalmanager", label: "Zonal Manage" },
  // { value: "usa", label: "USA" },
  // { value: "france", label: "France" },
  // { value: "russia", label: "Russia" },
  // { value: "canada", label: "Canada" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "dutch", label: "Dutch" },
];

const Profile = ({ data }) => {
  const formDetails = useSelector((state) => state.appformSlice);
  const profileDetails = useSelector(
    (state) => state.dashboardSlice.profileDetails
  );
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.dashboardSlice.isLoading);

  // ** Hooks
  const defaultValues = {
    firstname: _.get(profileDetails, "firstname", ""),
    lastname: _.get(profileDetails, "lastname", ""),
    middlename: _.get(profileDetails, "middlename", ""),
    address: _.get(profileDetails, "address", ""),
    district: _.get(profileDetails, "district", ""),
    taluka: _.get(profileDetails, "taluka", ""),
    zone: _.get(profileDetails, "zone", ""),
  };
  const {
    control,
    setError,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** States

  useEffect(() => {
    dispatch(getProfileValues());
  }, [dispatch]);

  const objDist = {
    value: _.get(profileDetails, "district.id", "")
      ? _.get(profileDetails, "district.id", "")
      : "",
    label: _.get(profileDetails, "district.name", "")
      ? _.get(profileDetails, "district.name", "")
      : "",
  };

  const objTaluka = {
    value: _.get(profileDetails, "taluka.id", "")
      ? _.get(profileDetails, "taluka.id", "")
      : "",
    label: _.get(profileDetails, "taluka.name", "")
      ? _.get(profileDetails, "taluka.name", "")
      : "",
  };

  const objZone = {
    value: _.get(profileDetails, "zone.id", "")
      ? _.get(profileDetails, "zone.id", "")
      : "",
    label: _.get(profileDetails, "zone.name", "")
      ? _.get(profileDetails, "zone.name", "")
      : "",
  };

  useEffect(() => {
    setValue("address", _.get(profileDetails, "address", ""));
    setValue("firstname", _.get(profileDetails, "firstname", ""));
    setValue("lastname", _.get(profileDetails, "lastname", ""));
    setValue("middlename", _.get(profileDetails, "middlename", ""));
    if (
      _.get(profileDetails, "district.id", "") &&
      _.get(profileDetails, "district.name", "")
    ) {
      setValue("district", objDist);
    }
    if (
      _.get(profileDetails, "taluka.id", "") &&
      _.get(profileDetails, "taluka.name", "")
    ) {
      setValue("taluka", objTaluka);
    }

    if (
      _.get(profileDetails, "zone.id", "") &&
      _.get(profileDetails, "zone.name", "")
    ) {
      setValue("zone", objZone);
    }
  }, [
    _.get(profileDetails, "district", ""),
    _.get(profileDetails, "taluka", ""),
    _.get(profileDetails, "zone", ""),
    setValue,
  ]);

  const onSubmit = async (data) => {
    console.log("data-=-=-=", data);
    if (true) {
      const disValye = {
        district: {
          id: _.get(data, "district.value", ""),
          name: _.get(data, "district.label", ""),
        },
        taluka: {
          id: _.get(data, "taluka.value", ""),
          name: _.get(data, "taluka.label", ""),
        },
        zone: {
          id: _.get(data, "zone.value", ""),
          name: _.get(data, "zone.label", ""),
        },
      };
      // return null
      const reqData = {
        firstname: _.get(data, "firstname", ""),
        lastname: _.get(data, "lastname", ""),
        middlename: _.get(data, "middlename", ""),
        address: _.get(data, "address", ""),
        district: _.get(data, "district.value", ""),
        taluka: _.get(data, "taluka.value", ""),
        zone: _.get(data, "zone.value", ""),
      };
      await dispatch(updateProfileValues(reqData, disValye));
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  useEffect(() => {
    dispatch(getDistrictList());
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

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Profile Details</CardTitle>
        </CardHeader>
        {isLoading ? (
          <ComponentSpinner className="my-2" />
        ) : (
          <CardBody className="py-2 my-25">
            <Form className="" onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="firstname">
                    First Name (અરજદાર નું નામ)
                  </Label>
                  <Controller
                    name="firstname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="firstname"
                        placeholder="John"
                        invalid={errors.firstname && true}
                        {...field}
                      />
                    )}
                  />
                </Col>
                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="middlename">
                    Middle Name (અરજદાર નું નામ)
                  </Label>
                  <Controller
                    name="middlename"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="middlename"
                        placeholder="John"
                        invalid={errors.middlename && true}
                        {...field}
                      />
                    )}
                  />
                </Col>
                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="lastname">
                    Last Name (અરજદાર નું નામ)
                  </Label>
                  <Controller
                    name="lastname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="lastname"
                        placeholder="John"
                        invalid={errors.lastname && true}
                        {...field}
                      />
                    )}
                  />
                </Col>
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="address">
                    Address (સરનામું)
                  </Label>

                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="address"
                        name="address"
                        placeholder="12, Business Park"
                        invalid={errors.address && true}
                        {...field}
                        theme={selectThemeColors}
                        isClearable={false}
                        // className={`react-select ${
                        //   errors.taluka ? "is-invalid" : ""
                        // }`}
                        // classNamePrefix="select"
                        // options={_.get(formDetails, "talukas", [])}
                        // onChange={handleTalukaChange}
                      />
                    )}
                  />
                </Col>
                <Col sm="4" className="mb-1">
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
                      </div>
                    )}
                  />
                </Col>
                <Col sm="4" className="mb-1">
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
                      </div>
                    )}
                  />
                </Col>
                <Col sm="4" className="mb-1">
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
                          defaultValue={objZone}
                        />
                      </div>
                    )}
                  />
                </Col>

                <Col className="mt-2" sm="12">
                  <Button
                    type="submit"
                    color="primary"
                    className="me-1"
                    disabled={profileDetails.isFormLoading}
                  >
                    <span className="align-middle me-50">
                      Save changes
                    </span>
                    {profileDetails.isFormLoading ? (
                      <Spinner
                        color="white"
                        className="align-middle ms-sm-25 ms-0"
                        size="sm"
                      />
                    ) : null}
                  </Button>
                  <Button color="secondary" outline>
                    Discard
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        )}
      </Card>
    </Fragment>
  );
};

export default Profile;
