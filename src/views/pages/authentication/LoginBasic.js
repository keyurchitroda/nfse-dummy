// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { AdminLoginUser, LoginUser } from "../../../redux/slices/authSlice";
import _ from "lodash";

const defaultValues = {
  password: "",
  loginEmail: "",
};

const LoginBasic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authReducer = useSelector((state) => state.authReducer);
  // const ability = useContext(AbilityContext);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      console.log("data", data);
      const reqData = {
        identifier: _.get(data, "loginEmail", ""),
        password: _.get(data, "password", ""),
      };
      await dispatch(AdminLoginUser(reqData, navigate, "User"));
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

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <svg
                width="36"
                height="42"
                viewBox="0 0 36 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_31_5516)">
                  <path
                    d="M31.2359 0H4.61317C2.06946 0 0 2.08696 0 4.65217V23.8478C0 23.8913 0 23.913 0 23.9565C0.0215569 28.2826 5.25988 30.3696 8.27784 27.3043L18.9269 16.4348L11.7916 12L13.5808 10.1957L22.1389 13.0435L25.6096 9.41304C26.1701 8.82609 27.0754 8.67391 27.7437 9.13043C28.6491 9.73913 28.7353 11 27.9808 11.7174L24.3377 15.2609L27.1617 23.8913L25.3725 25.6957L20.9748 18.4783L12.0072 27.8696C6.98443 33.1304 10.606 41.9348 17.8275 42C17.8922 42 17.9353 42 18 42C27.9377 42 36 33.8696 36 23.8478V4.80435C36 2.15217 33.8659 0 31.2359 0Z"
                    fill="#346AFF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_31_5516">
                    <rect width="36" height="42" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h2 className="brand-text text-primary ms-1">NFSA</h2>
            </Link>
            <CardTitle tag="h4" className="mb-1">
              Welcome to NFSA! 👋
            </CardTitle>
            <CardText className="mb-2">Please sign-in to your account</CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  id="loginEmail"
                  name="loginEmail"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                  {/* <Link to='/admin-login'>
                    <small>Admin Login</small>
                  </Link> */}
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="form-check mb-1">
                {/* <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label> */}
              </div>
              <Button
                type="submit"
                color="primary"
                block
                disabled={authReducer.isLoading}
              >
                {authReducer.isLoading ? (
                  <Spinner color="white" size="sm" />
                ) : null}
                <span className="ms-50">Sign in</span>
              </Button>
            </Form>

            <p className="text-center mt-2">
              <span className="me-25">Are you user?</span>
              <Link to="/login">
                <span>User login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginBasic;
