import { Card, List, message, PageHeader, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getEssays, selectOrderedFeedbackRequests } from 'store/feedback/feedbackSelector'
import { loadFeedbackRequests } from 'store/feedback/feedbackThunks'
import { FeedbackRequest } from 'store/feedback/feedbackTypes'
import { useReduxDispatch } from 'store/store'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Tab, Tabs } from 'react-bootstrap'
import { User, UserState } from 'store/user/userTypes'
import {  FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {ArrowRight} from 'react-bootstrap-icons'
import { Check2Circle } from 'react-bootstrap-icons'
import { HourglassSplit } from 'react-bootstrap-icons'
import { PlusCircle } from 'react-bootstrap-icons'
var selectedEssay:any =[];



export const EssayList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useReduxDispatch()
  const feedbackRequests = useSelector(selectOrderedFeedbackRequests)
  const essays = useSelector(getEssays)

  useEffect(() => {
    ; (async () => {
      setIsLoading(true)
      try {
        await dispatch(loadFeedbackRequests())
        setIsLoading(false)
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
      <div className="row">
        <div className="col-lg-8">
        <Tabs
          defaultActiveKey="All"
          transition={false}
          id="noanim-tab-example"
          className="mb-3">
  <Tab eventKey="All" title="All">

  <label htmlFor="header-search">
            <span className="visually-hidden">Search Essay Requests</span>
        </label>
        <FormControl
            type="text"
            id="search"
            placeholder="Search By Essay Title"
            name="searchBar"
            onKeyUp={getFilteredEssays}
            aria-describedby="basic-addon1"
        />

  <List
        itemLayout="horizontal"
        dataSource={feedbackRequests}
        renderItem={(item: FeedbackRequest) => {
          const essay = essays[item.essay]
          var tag = essay.content
          tag=tag.substring(0, 80);
          if((item.feedback!="") && (item.assigned_editors.length>0))
          {
          return (
            <List.Item onClick={() => showRequest(essay.pk)}>
              <Check2Circle color="green" size={32} id="iconStatus"/>
              <List.Item.Meta title={essay.name}/>
              {tag}...
            </List.Item>
          )
          }
          else if((item.feedback=="") && (item.assigned_editors.length>0))
          {
            return( <List.Item onClick={() => showRequest(essay.pk)}>
            <HourglassSplit color="orange" size={32} id="iconStatus"/>
            <List.Item.Meta title={essay.name}/>
            {tag}...
          </List.Item>)
          }
          else 
          {
            return( <List.Item onClick={() => showRequest(essay.pk)}>
            <PlusCircle color="grey" size={32}  id="iconStatus"/>
            <List.Item.Meta title={essay.name}/>
            {tag}...
          </List.Item>)
          }
        }} />
  </Tab>
  <Tab eventKey="New" title="New" >
  <List
        itemLayout="horizontal"
        dataSource={feedbackRequests}
        renderItem={(item: FeedbackRequest) => {
          const essay = essays[item.essay]
          var tag = essay.content
          tag=tag.substring(0, 80);
          if(item.assigned_editors.length<=0)
          {
          return (
            <List.Item onClick={() => showRequest(essay.pk)}>
            <PlusCircle color="grey" size={32}  id="iconStatus"/>
              <List.Item.Meta title={essay.name}/>
              {tag}...
            </List.Item>
          )
          }
        }} />
  </Tab>
  <Tab eventKey="Inprogress" title="Inprogress">
  <List
        itemLayout="horizontal"
        dataSource={feedbackRequests}
        renderItem={(item: FeedbackRequest) => {
          const essay = essays[item.essay]
          var tag = essay.content
          tag=tag.substring(0, 80);
          if((item.feedback=="") && (item.assigned_editors.length>0))
          {
          return (
            <List.Item onClick={() => showRequest(essay.pk)}>
            <HourglassSplit color="orange" size={32} id="iconStatus"/>
              <List.Item.Meta title={essay.name}/>
              {tag}...
            </List.Item>
          )
          }
        }} />
  </Tab>
  <Tab eventKey="Completed" title="Completed" >
  <List
        itemLayout="horizontal"
        dataSource={feedbackRequests}
        renderItem={(item: FeedbackRequest) => {
          const essay = essays[item.essay]
          var tag = essay.content
          tag=tag.substring(0, 80);
          if((item.feedback!="") && (item.assigned_editors.length>0))
          {
          return (
            <List.Item onClick={() => showRequest(essay.pk)}>
            <Check2Circle color="green" size={32} id="iconStatus"/>
              <List.Item.Meta title={essay.name}/>
              {tag}...
            </List.Item>
          )
          }
        }} />
  </Tab>
</Tabs>
        </div>
        <div className="col-lg-4" id="cardBox">
          <Card id="DetailBox">
            <h6>Essay Preview</h6><br/>
            <h4 id="cardheader"></h4><br/>
            <p id="cardcontent"></p>
            <Button onClick={moveToCreate} id="buttonToCreate">Create Feedback</Button>
          </Card>
        </div>
        </div>
    )
  }

  return (
    <>
      <PageHeader ghost={false} title="Feedback Requests" />
      <Card>{renderContent()}</Card>
    </>
  )

  function showRequest(id:any)
  {
    selectedEssay=[];
    selectedEssay=essays[id]
    document.querySelector('#cardheader')?.innerHTML= selectedEssay.name;
    document.querySelector('#cardcontent')?.innerHTML= selectedEssay.name;
    document.querySelector('#cardBox')?.style.display='block';

  }

  function moveToCreate()
  {
    location.href='../showfeedback/'+selectedEssay.pk+'/';
  }

function getFilteredEssays()
{
  let Esearch = document.querySelector('#search');
  var SearchElement= Esearch.value;
  SearchElement=SearchElement.toLowerCase();
  let x = document.getElementsByClassName('ant-list-item ant-list-item-no-flex');
  for (var i = 0; i < x.length; i++) { 
      if (!x[i].innerHTML.toLowerCase().includes(SearchElement)) {
          x[i].style.display="none";
      }
      else {
          x[i].style.display="block";                 
      }
  }

}
}
