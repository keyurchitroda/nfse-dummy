// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'

// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button } from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/register-v2.svg'
import illustrationsDark from '@src/assets/images/pages/register-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const RegisterCover = () => {
  // ** Hooks
  const { skin } = useSkin()

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_31_5516)">
              <path d="M31.2359 0H4.61317C2.06946 0 0 2.08696 0 4.65217V23.8478C0 23.8913 0 23.913 0 23.9565C0.0215569 28.2826 5.25988 30.3696 8.27784 27.3043L18.9269 16.4348L11.7916 12L13.5808 10.1957L22.1389 13.0435L25.6096 9.41304C26.1701 8.82609 27.0754 8.67391 27.7437 9.13043C28.6491 9.73913 28.7353 11 27.9808 11.7174L24.3377 15.2609L27.1617 23.8913L25.3725 25.6957L20.9748 18.4783L12.0072 27.8696C6.98443 33.1304 10.606 41.9348 17.8275 42C17.8922 42 17.9353 42 18 42C27.9377 42 36 33.8696 36 23.8478V4.80435C36 2.15217 33.8659 0 31.2359 0Z" fill="#346AFF" />
            </g>
            <defs>
              <clipPath id="clip0_31_5516">
                <rect width="36" height="42" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h2 className='brand-text text-primary ms-1'>NFSA</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' xs='12' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Adventure starts here 🚀
            </CardTitle>
            <CardText className='mb-2'>Make your app management easy and fun!</CardText>
            <Form className='auth-register-form mt-2' onSubmit={e => e.preventDefault()}>
              <div className='mb-1'>
                <Label className='form-label' for='register-username'>
                  Username
                </Label>
                <Input type='text' id='register-username' placeholder='johndoe' autoFocus />
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-email'>
                  Email
                </Label>
                <Input type='email' id='register-email' placeholder='john@example.com' />
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='register-password'>
                  Password
                </Label>
                <InputPasswordToggle className='input-group-merge' id='register-password' />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='terms' />
                <Label className='form-check-label' for='terms'>
                  I agree to
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button color='primary' block>
                Sign up
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/pages/login-cover'>
                <span>Sign in instead</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterCover
