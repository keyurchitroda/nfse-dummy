// ** React Imports
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "@store/authentication";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Button,
  Form,
  Input,
  FormFeedback,
  Spinner,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { signupService } from "../../../services/authService";

import toast from "react-hot-toast";

import _ from "lodash";

// Import Swiper React components
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/scss";
import "swiper/scss/autoplay";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import { RegisterUser } from "../../../redux/slices/authSlice";

SwiperCore.use([Autoplay, Pagination, Navigation]);

const defaultValues = {
  email: "",
  terms: false,
  mobile_number: "",
  password: "",
  confirmpassword: "",
};

const Register = () => {
  const loginSlider1 = "https://nfsabucket.s3.ap-south-1.amazonaws.com/Banner+1.png";
  const loginSlider2 = "https://nfsabucket.s3.ap-south-1.amazonaws.com/Banner+2.png";
  const loginSlider3 = "https://nfsabucket.s3.ap-south-1.amazonaws.com/Banner+3.png";

  // ** Hooks
  const ability = useContext(AbilityContext);
  const { skin } = useSkin();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.authReducer);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const handleErrorResponse = (error) => {
    if (error.email) {
      return toast.error(error.email[0]);
    }
    if (error.mobile_number) {
      return toast.error(error.mobile_number[0]);
    }
    if (error.username) {
      return toast.error(error.username[0]);
    }
  };

  const onSubmit = async (data) => {
    const tempData = { ...data };
    delete tempData.terms;
    if (
      Object.values(tempData).every((field) => field.length > 0) &&
      data.terms === true &&
      data.password === data.confirmpassword
    ) {
      const { mobile_number, email, password, confirmpassword } = data;
      const reqData = {
        email,
        mobile_number,
        password,
        confirm_password: confirmpassword,
      };
      try {
        // const response = await signupService(reqData);
        // if (_.get(response, "status", "") === 1) {
        //   toast.success(_.get(response, "message", ""));
        //   navigate("/otpverify");
        // }
        await dispatch(RegisterUser(reqData, navigate));
      } catch (error) {
        handleErrorResponse(_.get(error, "message.error", ""));
      }
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
            message: `Please enter a valid ${key}`,
          });
        }
        if (key === "terms" && data.terms === false) {
          setError("terms", {
            type: "manual",
          });
        }
        if (data.password !== data.confirmpassword) {
          setError("confirmpassword", {
            type: "manual",
            message: `Passwrod does not match with confirm password`,
          });
        }
      }
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link
          className="brand-logo"
          style={{ zIndex: "2" }}
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
        {/* <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col> */}

        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <Form
              action="/"
              className="auth-register-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Controller
                  id="email"
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                {errors.email ? (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                ) : null}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="register-mobile_number">
                  Mobile Number
                </Label>
                <Controller
                  id="mobile_number"
                  name="mobile_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      placeholder="johndoe"
                      invalid={errors.mobile_number && true}
                      {...field}
                    />
                  )}
                />
                {errors.mobile_number ? (
                  <FormFeedback>{errors.mobile_number.message}</FormFeedback>
                ) : null}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="register-password">
                  Password
                </Label>
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

              <div className="mb-1">
                <Label className="form-label" for="register-confirmpassword">
                  Confirm Password
                </Label>
                <Controller
                  id="confirmpassword"
                  name="confirmpassword"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.confirmpassword && true}
                      {...field}
                    />
                  )}
                />
                {errors.confirmpassword ? (
                  <FormFeedback>{errors.confirmpassword.message}</FormFeedback>
                ) : null}
              </div>

              <div className="form-check mb-1">
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="terms"
                      type="checkbox"
                      checked={field.value}
                      invalid={errors.terms && true}
                    />
                  )}
                />
                <Label className="form-check-label" for="terms">
                  I agree to
                  <a
                    className="ms-25"
                    href="/"
                    onClick={(e) => e.preventDefault()}
                  >
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button
                type="submit"
                block
                color="primary"
                disabled={authReducer.isLoading}
              >
                {authReducer.isLoading ? (
                  <Spinner color="white" size="sm" />
                ) : null}
                <span className="ms-50">Sign up</span>
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="me-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
          </Col>
        </Col>
        <Col className="d-none d-lg-flex align-items-center p-0" lg="8" sm="12">
          <Swiper
            slidesPerView={1}
            loop={true}
            autoplay
            pagination={{ clickable: true }}
            navigation
            onSlideChange={() => { }}
            onSwiper={(swiper) => { }}
          >
            <SwiperSlide>
              <div className="position-relative">
                <img
                  className="img-fluid"
                  width="100%"
                  style={{ height: "100vh" }}
                  src={loginSlider1}
                  alt="Login Cover"
                />
                <div
                  className="position-absolute text-white p-2"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, 40%)",
                    backgroundColor: '#0000007a', borderRadius: '5px'
                  }}
                >
                  <h1 className="text-white">Welcome NFSA Functionality</h1>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book..
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="position-relative">
                <img
                  className="img-fluid"
                  width="100%"
                  style={{ height: "100vh" }}
                  src={loginSlider2}
                  alt="Login Cover"
                />
                <div
                  className="position-absolute text-white p-2"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, 40%)",
                    backgroundColor: '#0000007a', borderRadius: '5px'
                  }}
                >
                  <h1 className="text-white">Welcome NFSA Functionality</h1>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book..
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="position-relative">
                <img
                  className="img-fluid"
                  width="100%"
                  style={{ height: "100vh" }}
                  src={loginSlider3}
                  alt="Login Cover"
                />
                <div
                  className="position-absolute text-white p-2"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, 40%)",
                    backgroundColor: '#0000007a', borderRadius: '5px'
                  }}
                >
                  <h1 className="text-white">Welcome NFSA Functionality</h1>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book..
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
