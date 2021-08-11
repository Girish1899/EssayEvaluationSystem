import { Form, List, message, PageHeader, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Collapse, Button, CardBody, Card, UncontrolledCollapse, Container, Row, Col } from 'reactstrap';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { getEssays, selectOrderedFeedbackRequests } from 'store/showfeedback/showfeedbackSelector'
import { loadFeedbackRequests,CreateFeedback,datAPI } from 'store/showfeedback/showfeedbackThunks'
import { FeedbackRequest } from 'store/showfeedback/showfeedbackTypes'
import { useReduxDispatch } from 'store/store'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Dropdown, DropdownButton, FormControl } from 'react-bootstrap';
var essayTitle:any ;

export const Showfeedback = () => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useReduxDispatch()
  const feedbackRequests = useSelector(selectOrderedFeedbackRequests)
  const essays = useSelector(getEssays)
  
  useEffect(() => {
    ; (async () => {
      setIsLoading(true)
      try {
        await dispatch(loadFeedbackRequests())
        if(datAPI!=undefined)
        {
          essayTitle=datAPI[0]['essay']['name'];
          setIsLoading(false)
        }
      } catch (err) {
        setIsLoading(false)
        message.error('Failed to load essays. Please refresh this page to try again.')
      }
    })()
  }, [dispatch])

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card className="center">
          <Spin />
        </Card>
      )
    }

    return (
      <div>
        <div id="headerDiv">
        <h4 id="essayTittle">{essayTitle}</h4>
         <input className="btn btn-success" type="submit" value="Submit Feedback" onClick={shoot} />
        </div>
        <br/>
        <div id="PreviousDiv">
        <h5>Previous Feedback</h5><br/>
      <List
        itemLayout="horizontal"
        dataSource={feedbackRequests}
        renderItem={(item: FeedbackRequest) => {
          const essay = essays[item.essay];
          if (item.feedback) {
            return (
              <div>
                <List.Item id="previouslistItemId">
                <Accordion>
  <Accordion.Item eventKey={essay.pk}>
    <Accordion.Header>{essay.name}</Accordion.Header>
    <Accordion.Body>
    <Container>
                          <Row>
                            <Col> {item.essay_Given_By_Student}</Col>
                            <Col>{item.feedback}</Col>
                          </Row>
                        </Container>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
                
              </List.Item></div>);
          }

          else {
            return (
              <List.Item id="listItemId">
                <Container>
                  <Row>
                    <Col>
                      <label><b>Essay</b></label><br />
                      {item.essay_Given_By_Student}</Col>
                    <Col>  <input type="hidden" name="name" id="name" value={essay.name} />
                      <input type="hidden" name="id" id="id" value={essay.pk} />
                      <label><b>Your Feedback</b></label>
                      <FormControl as="textarea" aria-label="With textarea" name="feedback" id="feedback" rows={8}/><br />
                    </Col>
                  </Row>
                </Container>
              </List.Item>
            );
          }
        } } />
        </div>
        </div>
        
    )
  }


  return (
    <>
      <Card id="MainCard">{renderContent()}</Card>
    </>
  )
  
  async function shoot() {
    event.preventDefault();
    let EidTag = document.querySelector('#id');
    var EId = EidTag.value;
    let ENameTag = document.querySelector('#name');
    var EName = ENameTag.value;
    let EfeedbackTag = document.querySelector('#feedback');
  var Efeedback = EfeedbackTag.value;
  
    try {
      await dispatch(CreateFeedback({ EId,EName,Efeedback }))
      window.location.href = '/platform/'
    } catch (ex) {
      setError('Please Fill all the fields.')
      setIsLoading(false)
    }
    
  }

  
}










