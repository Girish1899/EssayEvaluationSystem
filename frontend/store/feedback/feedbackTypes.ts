export type Essay = {
  pk: number
  name: string
  uploaded_by: number
  content: string
  revision_of: number | null
}

export type FeedbackRequest = {
  pk: number
  essay: number
  edited: boolean
  deadline: string
  assigned_editors:[]
  feedback:string
}

export type FeedbackState = {
  feedbackRequests: {
    [pk: number]: FeedbackRequest
  }
  essays: {
    [pk: number]: Essay
  }
}
