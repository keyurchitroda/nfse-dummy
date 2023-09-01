// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Demo Components
import ApplicationDetail from './ApplicationDetail'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { getApplicationDetail } from '../../../redux/slices/dashboardSlice'

const Textarea = () => {
  const params = useParams();
  const dispatch = useDispatch();
  console.log("params", params);


  useEffect(() => {
    dispatch(getApplicationDetail(params.id))
  }, [])


  return (
    <Fragment>
      <Breadcrumbs title='Application Detail' data={[{ title: 'Application Detail' }]} />
      <Row>
        <Col sm='12'>
          <ApplicationDetail />
        </Col>
      </Row>
    </Fragment>
  )
}
export default Textarea
