import { Dispatch } from '@reduxjs/toolkit'
import API from 'store/api'
import { Urls } from 'store/urls'
import { addEssays, addFeedbackRequests } from './showfeedbackSlice'
import { Essay, FeedbackRequest } from './showfeedbackTypes'

type FeedbackRequestRetrieve = Omit<FeedbackRequest, 'essay'> & {
  essay: Essay
}
export var datAPI:any;
export const CreateFeedback = ({ EId, EName,Efeedback }: { EId: string; EName: string,Efeedback:string }) => async (
  dispatch: Dispatch,
) => {
  // eslint-disable-next-line no-useless-catch
  try {
   const result = await API.post(Urls.createFeedback(), { EId, EName,Efeedback })
    return result
  } catch (err) {
    throw err
  }
}

export const loadFeedbackRequests = () => async (dispatch: Dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data: frrs }: { data: FeedbackRequestRetrieve[] } = await API.get(Urls.showfeedback())
    datAPI=frrs
    const allFeedbackRequests: FeedbackRequest[] = []
    const allEssays: Essay[] = []
    frrs.forEach(frr => {
      const { essay, ...frrDestructured } = frr
      const feedbackRequest: Partial<FeedbackRequest> = { ...frrDestructured }
      feedbackRequest.essay = essay.pk
      allEssays.push(essay)
      allFeedbackRequests.push(feedbackRequest as FeedbackRequest)
    })
    dispatch(addFeedbackRequests(allFeedbackRequests))
    dispatch(addEssays(allEssays))
    return allFeedbackRequests
  } catch (err) {
    throw err
  }
}
