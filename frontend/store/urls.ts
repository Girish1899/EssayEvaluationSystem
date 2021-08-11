var queryString = window.location.pathname;
queryString=queryString.substring(14);
console.log("window.location.pathname",queryString);
const urlParams = new URLSearchParams();
export const Urls = {
  Login: () => '/login/',
  Logout: () => '/logout/',
  User: () => '/api/user/',
  FeedbackRequest: () => '/api/feedback-request/',
  showfeedback:() => '/feedbackdetail-request/'+queryString,
  createFeedback:() => '/createFeedBack/'
}
