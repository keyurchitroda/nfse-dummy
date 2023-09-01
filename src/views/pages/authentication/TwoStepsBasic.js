// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Form,
  Input,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { otpVerifyService } from "../../../services/authService";
import toast from "react-hot-toast";

const TwoStepsBasic = () => {
  const registerEmail = useSelector((state) => state.authReducer.email);

  const defaultValues = {
    email: registerEmail,
    otp: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const reqData = {
      email: registerEmail,
      otp: data.otp,
    };
    try {
      const response = await otpVerifyService(reqData);
      if (response.status === 1) {
        toast.success(response.message);
        navigate("/login");
      } else {
        toast.success("Invalid OTP..!");
      }
    } catch (error) {
      toast.error(error.message.message);
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
            <CardTitle tag="h2" className="fw-bolder mb-1">
              OTP Verification 💬
            </CardTitle>
            <CardText className="mb-75">
              We sent a verification code to your email <b>${registerEmail}</b>.
              Enter the code from the email in the field below.
            </CardText>
            {/* <CardText className="fw-bolder mb-2">abc@gmail.com</CardText> */}
            <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
              <h6>Type your 6 digit security code</h6>
              <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                {/* <Input
                  autoFocus
                  maxLength="1"
                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                />
                <Input
                  maxLength="1"
                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                />
                <Input
                  maxLength="1"
                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                />
                <Input
                  maxLength="1"
                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                />
                <Input
                  maxLength="1"
                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                />
                <Input
                  maxLength="1"
                  className="auth-input height-50 text-center numeral-mask mx-25 mb-1"
                /> */}
                <Controller
                  id="otp"
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      maxLength={6}
                      type="text"
                      autoFocus
                      placeholder="OTP"
                      invalid={errors.otp && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <Button
                type="submit"
                block
                color="primary"
                style={{ marginTop: "15px" }}
              >
                OTP Verify
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span>Back to register</span>{" "}
              <a href="/register" onClick={(e) => e.preventDefault()}>
                Register
              </a>{" "}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TwoStepsBasic;
