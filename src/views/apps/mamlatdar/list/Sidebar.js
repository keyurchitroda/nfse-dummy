// ** React Import
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, Spinner } from "reactstrap";

// ** Store & Actions
import { addUser } from "../store";
import { useDispatch } from "react-redux";
import { addNewUserByAdmin } from "../../../../services/dashboardService";

const defaultValues = {
  email: "",
  mobile: "",
  password: "",
  roles: "",
};

const checkIsValid = (data) => {
  console.log("valid", data);
  return Object.values(data).every((field) =>
    typeof field === "object" ? field !== null : field.length > 0
  );
};

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Store Vars
  const dispatch = useDispatch();

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    if (checkIsValid(data)) {
      try {
        setIsLoading(true);
        const reqData = {
          email: data?.email,
          mobile_number: data?.mobile,
          password: data?.password,
          role: data?.roles.value,
        };
        const response = await addNewUserByAdmin(reqData);
        if (response.status === 1) {
          setIsLoading(false);
          toggleSidebar();
          await dispatch(getAllAdminUsers(1));
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
      }
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError("roles", {
            type: "manual",
          });
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, "");
    }
    setRole("subscriber");
    setPlan("basic");
  };

  const rolesOptions = [
    { value: "Mamlatdar", label: "Mamlatdar" },
    { value: "Zonal Officer", label: "Zonal Officer" },
    { value: "deputymamlatdar", label: "Deputy Mamlatdar" },
  ];

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Mamlatdar"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="email">
            Email <span className="text-danger">*</span>
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                id="email"
                placeholder="john.doe@example.com"
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color="muted">
            You can use letters, numbers & periods
          </FormText>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="mobile">
            Mobile <span className="text-danger">*</span>
          </Label>
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <Input
                id="mobile"
                placeholder="(397) 294-5153"
                invalid={errors.mobile && true}
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="password">
            Password <span className="text-danger">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                id="password"
                type="password"
                placeholder="******"
                invalid={errors.password && true}
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="roles">
            Role <span className="text-danger">*</span>
          </Label>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix="select"
                options={rolesOptions}
                theme={selectThemeColors}
                className={`react-select ${errors.roles ? "is-invalid" : ""}`}
                invalid={errors.roles && true}
                {...field}
              />
            )}
          />
        </div>

        <Button type="submit" className="me-1" color="primary">
          {/* Submit */}
          {isLoading ? <Spinner color="white" size="sm" /> : null}
          <span className="ms-50">Submit</span>
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  );
};

export default SidebarNewUsers;
