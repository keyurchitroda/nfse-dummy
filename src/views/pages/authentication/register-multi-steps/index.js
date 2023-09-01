// ** React Imports
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Third Party Components
import { Home, User, CreditCard } from 'react-feather'

// ** Steps
import Billing from './steps/Billing'
import PersonalInfo from './steps/PersonalInfo'
import AccountDetails from './steps/AccountDetails'

// ** Image Imports
import source from '@src/assets/images/pages/create-account.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const RegisterMultiSteps = () => {
  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'account-details',
      title: 'Account',
      subtitle: 'Enter username',
      icon: <Home size={18} />,
      content: <AccountDetails stepper={stepper} />
    },
    {
      id: 'personal-info',
      title: 'Personal',
      subtitle: 'Enter Information',
      icon: <User size={18} />,
      content: <PersonalInfo stepper={stepper} />
    },
    {
      title: 'Billing',
      id: 'step-billing',
      subtitle: 'Payment Details',
      icon: <CreditCard size={18} />,
      content: <Billing stepper={stepper} />
    }
  ]

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/'>
          <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_31_5516)">
<path d="M31.2359 0H4.61317C2.06946 0 0 2.08696 0 4.65217V23.8478C0 23.8913 0 23.913 0 23.9565C0.0215569 28.2826 5.25988 30.3696 8.27784 27.3043L18.9269 16.4348L11.7916 12L13.5808 10.1957L22.1389 13.0435L25.6096 9.41304C26.1701 8.82609 27.0754 8.67391 27.7437 9.13043C28.6491 9.73913 28.7353 11 27.9808 11.7174L24.3377 15.2609L27.1617 23.8913L25.3725 25.6957L20.9748 18.4783L12.0072 27.8696C6.98443 33.1304 10.606 41.9348 17.8275 42C17.8922 42 17.9353 42 18 42C27.9377 42 36 33.8696 36 23.8478V4.80435C36 2.15217 33.8659 0 31.2359 0Z" fill="#346AFF"/>
</g>
<defs>
<clipPath id="clip0_31_5516">
<rect width="36" height="42" fill="white"/>
</clipPath>
</defs>
</svg>
          <h2 className='brand-text text-primary ms-1'>NFSA</h2>
        </Link>
        <Col lg='3' className='d-none d-lg-flex align-items-center p-0'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center'>
            <img className='img-fluid w-100' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col lg='9' className='d-flex align-items-center auth-bg px-2 px-sm-3 px-lg-5 pt-3'>
          <div className='width-700 mx-auto'>
            <Wizard
              ref={ref}
              steps={steps}
              headerClassName='px-0'
              instance={el => setStepper(el)}
              contentWrapperClassName='px-0 mt-4'
              className='register-multi-steps-wizard shadow-none'
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterMultiSteps
