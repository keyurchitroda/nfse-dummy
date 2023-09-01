// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Invoice List Sidebar
import Sidebar from "./Sidebar";

// ** Table Columns
import { columns } from "./columns";

// ** Store & Actions
import { getAllData, getData } from "../store";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  ChevronUp,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
  ChevronsDown,
} from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Form,
  Spinner,
  Collapse,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import {
  filterApplicationListByUser,
  getApplicationListByUser,
} from "../../../../redux/slices/dashboardSlice";
import ComponentSpinner from "../../../../@core/components/spinner/Loading-spinner";
// import { ChevronDown } from "react-feather";
import {
  getDistrictList,
  getTalukaList,
  getZonesList,
} from "../../../../redux/slices/appformSlice";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import { getCookie } from "../../../../config/cookies";

// ** Table Header
const CustomHeader = ({
  store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  const dispatch = useDispatch();
  // ** Get data on mount
  useEffect(() => {
    dispatch(getAllData());
    dispatch(getApplicationListByUser(1));
  }, [dispatch]);

  // ** User filter options
  const roleOptions = [
    { value: "", label: "Select Role" },
    { value: "admin", label: "Admin" },
    { value: "author", label: "Author" },
    { value: "editor", label: "Editor" },
    { value: "maintainer", label: "Maintainer" },
    { value: "subscriber", label: "Subscriber" },
  ];

  const statusVal = [
    { value: "Approve", label: "Approve" },
    { value: "Reject", label: "Reject" },
  ];

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({});

  const dateFormat = (date) => {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
    const day = inputDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate); // Output: "2023-08-24"
    return formattedDate;
  };

  const onSubmit = async (data) => {
    await dispatch(
      filterApplicationListByUser(
        1,
        data,
        startDate && dateFormat(startDate),
        endDate && dateFormat(endDate)
      )
    );
  };

  const resetFilter = async () => {
    reset();
    setValue("district", { value: null, label: null });
    setValue("taluka", { value: null, label: null });
    setValue("zone", { value: null, label: null });
    setValue("status", { value: null, label: null });
    setDateRange([null, null]);
    await dispatch(getApplicationListByUser(1));
  };

  const formDetails = useSelector((state) => state.appformSlice);
  const profileDetails = useSelector(
    (state) => state.dashboardSlice.profileDetails
  );
  const isLoading = useSelector((state) => state.dashboardSlice.isLoading);

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

  const role1 = getCookie("role");
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      <Card className="w-100 m-0 bg-white">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader onClick={toggle}>
            <CardTitle className="d-flex align-items-center justify-content-between w-100">
              <div>
                Filters
                {!isOpen ? (
                  <ChevronDown size={20} className="ms-1" />
                ) : (
                  <ChevronUp size={20} className="ms-1" />
                )}
              </div>
              <div>
                <Col>
                  {/* <Button
                      type="submit"
                      color="primary"
                      className="me-1"
                      disabled={profileDetails.isFormLoading}
                    >
                      <span className="align-middle me-50">Search</span>
                      {profileDetails.isFormLoading ? (
                        <Spinner
                          color="white"
                          className="align-middle ms-sm-25 ms-0"
                          size="sm"
                        />
                      ) : null}
                    </Button> */}
                  <Button color="secondary" outline onClick={resetFilter}>
                    Reset
                  </Button>
                </Col>
              </div>
            </CardTitle>
          </CardHeader>
          <Collapse isOpen={isOpen}>
            <CardBody className="py-2 my-25 pt-0 mt-0">
              <Row>
                {role1 === "Admin" && (
                  <>
                    {" "}
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
                              // defaultValue={objDist}
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
                              // defaultValue={objZone}
                            />
                          </div>
                        )}
                      />
                    </Col>
                  </>
                )}

                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="status">
                    Status
                  </Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <div>
                        <Select
                          {...field}
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`status`}
                          className={`react-select ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                          options={statusVal}
                          // defaultValue={objZone}
                        />
                      </div>
                    )}
                  />
                </Col>

                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="daterange">
                    Date
                  </Label>
                  <Controller
                    control={control}
                    name="daterange"
                    render={({ field }) => (
                      <div>
                        <DatePicker
                          {...field}
                          classNamePrefix="date"
                          theme={selectThemeColors}
                          selectsRange={true}
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="Please select date"
                          onChange={(update) => {
                            setDateRange(update);
                          }}
                          className={`react-select form-control  ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          isClearable={true}
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
                    <span className="align-middle me-50">Search</span>
                    {profileDetails.isFormLoading ? (
                      <Spinner
                        color="white"
                        className="align-middle ms-sm-25 ms-0"
                        size="sm"
                      />
                    ) : null}
                  </Button>
                  <Button color="secondary" outline onClick={resetFilter}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Collapse>
        </Form>
      </Card>
    </>
  );
};

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.users);
  const dashboardSlice = useSelector((state) => state.dashboardSlice);
  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    value: "",
    label: "Select Role",
  });
  const [currentPlan, setCurrentPlan] = useState({
    value: "",
    label: "Select Plan",
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: "Select Status",
    number: 0,
  });

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getAllData());
    dispatch(getApplicationListByUser(1));
  }, [dispatch]);

  // ** User filter options
  const roleOptions = [
    { value: "", label: "Select Role" },
    { value: "admin", label: "Admin" },
    { value: "author", label: "Author" },
    { value: "editor", label: "Editor" },
    { value: "maintainer", label: "Maintainer" },
    { value: "subscriber", label: "Subscriber" },
  ];

  const statusVal = [
    { value: "Approve", label: "Approve" },
    { value: "Reject", label: "Reject" },
  ];

  // ** Function in get data on page change
  const handlePagination = async (page) => {
    await dispatch(getApplicationListByUser(page?.selected + 1));
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
    dispatch(
      getData({
        sort,
        q: val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        role: currentRole.value,
        status: currentStatus.value,
        currentPlan: currentPlan.value,
      })
    );
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    // const count = Number(Math.ceil(store.total / rowsPerPage));
    const totalPageCount = Math.ceil(dashboardSlice?.count / 10);

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={totalPageCount}
        activeClassName="active"
        forcePage={
          dashboardSlice.currentPage !== 0 ? dashboardSlice.currentPage - 1 : 0
        }
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      role: currentRole.value,
      currentPlan: currentPlan.value,
      status: currentStatus.value,
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    return dashboardSlice.applicationlistByLoginUser;
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        role: currentRole.value,
        status: currentStatus.value,
        currentPlan: currentPlan.value,
      })
    );
  };

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({});

  const dateFormat = (date) => {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
    const day = inputDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate); // Output: "2023-08-24"
    return formattedDate;
  };

  const onSubmit = async (data) => {
    await dispatch(
      filterApplicationListByUser(
        1,
        data,
        startDate && dateFormat(startDate),
        endDate && dateFormat(endDate)
      )
    );
  };

  const resetFilter = async () => {
    reset();
    setValue("district", { value: null, label: null });
    setValue("taluka", { value: null, label: null });
    setValue("zone", { value: null, label: null });
    setValue("status", { value: null, label: null });
    setDateRange([null, null]);
    await dispatch(getApplicationListByUser(1));
  };

  const formDetails = useSelector((state) => state.appformSlice);
  const profileDetails = useSelector(
    (state) => state.dashboardSlice.profileDetails
  );
  const isLoading = useSelector((state) => state.dashboardSlice.isLoading);

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

  const role = getCookie("role");

  return (
    <Fragment>
      {/* {(role === "Admin" || role === "Collector") && (
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Filters</CardTitle>
          </CardHeader>
          <CardBody className="py-2 my-25 pt-0 mt-0">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
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
                          // defaultValue={objDist}
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
                          // defaultValue={objZone}
                        />
                      </div>
                    )}
                  />
                </Col>

                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="status">
                    Status
                  </Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <div>
                        <Select
                          {...field}
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`status`}
                          className={`react-select ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                          options={statusVal}
                          // defaultValue={objZone}
                        />
                      </div>
                    )}
                  />
                </Col>

                <Col sm="4" className="mb-1">
                  <Label className="form-label" for="daterange">
                    Date
                  </Label>
                  <Controller
                    control={control}
                    name="daterange"
                    render={({ field }) => (
                      <div>
                        <DatePicker
                          {...field}
                          classNamePrefix="date"
                          theme={selectThemeColors}
                          selectsRange={true}
                          startDate={startDate}
                          endDate={endDate}
                          placeholderText="Please select date"
                          onChange={(update) => {
                            setDateRange(update);
                          }}
                          className={`react-select form-control  ${
                            errors.status ? "is-invalid" : ""
                          }`}
                          isClearable={true}
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
                    <span className="align-middle me-50">Search</span>
                    {profileDetails.isFormLoading ? (
                      <Spinner
                        color="white"
                        className="align-middle ms-sm-25 ms-0"
                        size="sm"
                      />
                    ) : null}
                  </Button>
                  <Button color="secondary" outline onClick={resetFilter}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      )} */}

      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            progressPending={dashboardSlice.isLoading}
            progressComponent={<ComponentSpinner className="my-2" />}
            paginationServer
            columns={columns}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default UsersList;
