import { lazy } from 'react'

const Wizard = lazy(() => import('../../views/forms/wizard'))

const FormRoutes = [
  {
    element: <Wizard />,
    path: '/forms/wizard'
  }
]

export default FormRoutes
