// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { addUser } from '../store'
import { useDispatch } from 'react-redux'

const defaultValues = {
  email: '',
  contact: '',
  fullName: '',
  password: ''
}


const checkIsValid = data => {
  console.log("valid",data);
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
}

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null)
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    setData(data)
    console.log("data", data)
    if (checkIsValid(data)) {
      console.log("data===>", data)
      toggleSidebar()
      dispatch(
        addUser({
          role,
          avatar: '',
          email: data.email,
          contact: data.contact,
          fullName: data.fullName,
          password: data.password
        })
      )
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError('country', {
            type: 'manual'
          })
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setRole('subscriber')
    setPlan('basic')
  }

  return (
    <Sidebar
      size='lg'
      open={open}
      title='New Mamlatdar'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='fullName'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => (
              <Input id='fullName' placeholder='John Doe' invalid={errors.fullName && true} {...field} />
            )}
          />
        </div>
        {/* <div className='mb-1'>
          <Label className='form-label' for='username'>
            Username <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <Input id='username' placeholder='johnDoe99' invalid={errors.username && true} {...field} />
            )}
          />
        </div> */}

        <div className='mb-1'>
          <Label className='form-label' for='userEmail'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='userEmail'
                placeholder='john.doe@example.com'
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color='muted'>You can use letters, numbers & periods</FormText>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='contact'>
            Contact <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='contact'
            control={control}
            render={({ field }) => (
              <Input id='contact' placeholder='(397) 294-5153' invalid={errors.contact && true} {...field} />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='password'>
            Password <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input id='password' type='password' placeholder='******' invalid={errors.password && true} {...field} />
            )}
          />
        </div>
        {/* <div className='mb-1'>
          <Label className='form-label' for='company'>
            Company <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='company'
            control={control}
            render={({ field }) => (
              <Input id='company' placeholder='Company Pvt Ltd' invalid={errors.company && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='country'>
            Country <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              // <Input id='country' placeholder='Australia' invalid={errors.country && true} {...field} />
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={countryOptions}
                theme={selectThemeColors}
                className={classnames('react-select', { 'is-invalid': data !== null && data.country === null })}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='user-role'>
            User Role
          </Label>
          <Input type='select' id='user-role' name='user-role' value={role} onChange={e => setRole(e.target.value)}>
            <option value='subscriber'>Subscriber</option>
            <option value='editor'>Editor</option>
            <option value='maintainer'>Maintainer</option>
            <option value='author'>Author</option>
            <option value='admin'>Admin</option>
          </Input>
        </div>
        <div className='mb-1' value={plan} onChange={e => setPlan(e.target.value)}>
          <Label className='form-label' for='select-plan'>
            Select Plan
          </Label>
          <Input type='select' id='select-plan' name='select-plan'>
            <option value='basic'>Basic</option>
            <option value='enterprise'>Enterprise</option>
            <option value='company'>Company</option>
            <option value='team'>Team</option>
          </Input>
        </div> */}
        <Button type='submit' className='me-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
