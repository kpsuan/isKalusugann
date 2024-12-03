import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import MoreInfo from './pages/MoreInfo'
import Dashboard from './Dashboard/Dashboard'
import AnnualPe from './Dashboard/Components/Annual/AnnualPe';
import OnlinePe from './Dashboard/Components/Annual/Online/OnlinePE';
import OnlineSubmission from './Dashboard/Components/Annual/Online/Submission/OnlineSubmission';
import SubmissionInfo from './Dashboard/Components/Annual/Online/Submission/SubmissionInfo';
import Result from './Dashboard/Components/Annual/Online/Result/Result';
import InPerson from './Dashboard/Components/Annual/InPerson/InPerson';
import InPerson2 from './Dashboard/Components/Annual/InPerson/components/inPerson2';
import InPerson3 from './Dashboard/Components/Annual/InPerson/components/inPerson3';
import ResultInPerson from './Dashboard/Components/Annual/InPerson/Result/ResultIP';
import Appointments from './Dashboard/Components/Annual/Appointment/Appointment';
import ScheduleAppointment from './Dashboard/Components/Annual/Appointment/pages/scheduleAppointment';
import AdminPE from './Dashboard/Components/Admin/AnnualPE/AnnualAdmin'
import DashPost from './Dashboard/Components/Admin/Announcements/DashPost';
import toast from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import OnlySuperAdminRoute from './components/OnlySuperAdminRoute';
import Announcement from './Dashboard/Components/Admin/Announcements/Announcement';
import CreatePost from './Dashboard/Components/Admin/Announcements/CreatePost';
import UpdatePost from './Dashboard/Components/Admin/Announcements/UpdatePost';
import UsersOnline from './Dashboard/Components/Admin/AnnualPE/UsersOnline';
import Online from './Dashboard/Components/Admin/AnnualPE/Online';
import UpdateStatus from './Dashboard/Components/Admin/AnnualPE/UpdateStatus';
import Certificate from './Dashboard/Components/Admin/AnnualPE/Certificate';
import UserInPerson from './Dashboard/Components/Admin/AnnualPE/UserInPerson';
import InPersonRes from './Dashboard/Components/Admin/AnnualPE/InPerson';
import Documents from './Dashboard/Components/Admin/Documents/Documents';
import GetDocs from './Dashboard/Components/Admin/Documents/GetDocs';
import DocsUserView from './Dashboard/Components/DocumentsUser/DocsUserView';
import GetAllDocs from './Dashboard/Components/DocumentsUser/GetAllDocs';
import ScheduledToday from './Dashboard/Components/Admin/AnnualPE/ScheduledToday';
import ScheduledOn from './Dashboard/Components/Admin/AnnualPE/ScheduledOn';
import ViewIn from './Dashboard/Components/Admin/AnnualPE/ViewIn';
import GetCourse from './Dashboard/Components/Admin/AnnualPE/GetCourse';
import GetCollege from './Dashboard/Components/Admin/AnnualPE/GetCollege';
import ViewSubmissions from './Dashboard/Components/Admin/AnnualPE/ViewSubmissions';
import CourseStudents from './Dashboard/Components/Admin/AnnualPE/CourseStudents';
import CollegeStudents from './Dashboard/Components/Admin/AnnualPE/CollegeStudents';
import AnnualHome from './Dashboard/Components/Annual/AnnualHome';
import Status from './Dashboard/Components/Annual/Status';
import Online2 from './Dashboard/Components/Annual/Online/Online2';
import FileSubmission from './Dashboard/Components/Annual/Online/Submission/FileSubmission';
import Reschedule from './Dashboard/Components/Admin/AnnualPE/Reschedule';
import RescheduleStatus from './Dashboard/Components/Admin/AnnualPE/RescheduleStatus';
import SuperAdminInPerson from './Dashboard/Components/Admin/AnnualPE/SuperAdminInPerson';
import Post from './Dashboard/Components/AnnouncementUser/Post';
import AnnualHomeAdmin from './Dashboard/Components/Admin/AnnualPE/AnnualHomeAdmin';
import UserProfile from './pages/userProfile';
import CompleteDocuments from './Dashboard/Components/Admin/AnnualPE/CompleteDocuments';
import NoDocsSubmitted from './Dashboard/Components/Admin/AnnualPE/NoDocsSubmitted';
import IncDocuments from './Dashboard/Components/Admin/AnnualPE/IncDocuments';
import Event from './Dashboard/Components/Admin/Events/Event';
import Attendance from './pages/Attendance';
import Attendance2 from './pages/Attendance2';
import CreateEvent from './Dashboard/Components/Admin/Events/CreateEvent';
import OverallArrived from './Dashboard/Components/Admin/AnnualPE/OverallArrived';
import YesterdayPresent from './Dashboard/Components/Admin/AnnualPE/YesterdayPresent';
import OverallAbsent from './Dashboard/Components/Admin/AnnualPE/OverallAbsent';
import ScheduledForToday2 from './Dashboard/Components/Admin/AnnualPE/ScheduledToday2';
import TopHeader from './components/TopHeader';
import Facilities from './pages/Facilities';
import News from './pages/News';


export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/facilities' element={<Facilities />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/attendance' element={<Attendance />} />
        <Route path="/events" element={<Event />} />

       
        <Route element={<PrivateRoute />}>
          <Route path='/attendance2' element={<Attendance2 />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/my-Profile' element={<MoreInfo />} />
          <Route path='/moreInfo' element={<MoreInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/annualPE" element={<AnnualPe />} />
          <Route path="/onlinePE" element={<OnlinePe />} />
          <Route path="/onlineSub" element={<OnlineSubmission />} />
          <Route path="/submissionInfo" element={<SubmissionInfo />} />
          <Route path="/result" element={<Result />} />
          <Route path="/inPerson" element={<InPerson />} />
          <Route path="/inPerson2" element={<InPerson2 />} />
          <Route path="/inPerson3" element={<InPerson3 />} />
          <Route path="/result-inperson" element={<ResultInPerson />} />
          <Route path="/appointment" element={<Appointments />} />
          <Route path="/appointmentDetails" element={<ScheduleAppointment />} />
          <Route path="/announcement" element={<Announcement />} />
          <Route path="/news" element={<News />} />
          <Route path="/dash-post" element={<DashPost />} />
          <Route path="/get-documents" element={<GetDocs />} />
          <Route path="/get-allDocuments" element={<GetAllDocs />} />
          <Route path="/docsuser" element={<DocsUserView />} />
          <Route path="/annualhome" element={<AnnualHome />} />
          <Route path="/status" element={<Status />} />
          <Route path="/online2" element={<Online2 />} />
          <Route path="/fileSubmissions" element={<FileSubmission />} />
          <Route path="/post/:postSlug" element={<Post />} />
          <Route path="/completeDocs" element={<CompleteDocuments />} />
          <Route path="/noDocs" element={<NoDocsSubmitted />} />
          <Route path="/incDocs" element={<IncDocuments />} />



        </Route>

        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/adminPE" element={<AdminPE />} />
          <Route path="/adminHome" element={<AnnualHomeAdmin />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/manage-online" element={<Online />} />
          <Route path="/manageInPerson" element={<InPersonRes />} />
          <Route path="/show-inPerson" element={<UserInPerson />} />
          <Route path="/show-online" element={<UsersOnline />} />
          <Route path="/user-status/:userId" element={<UpdateStatus />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />


          <Route path="/resched-status/:userId" element={<RescheduleStatus />} />

          <Route path="/certificate/:userId" element={<Certificate />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/scheduledToday" element={<ScheduledToday />} />
          <Route path="/scheduledToday2" element={<ScheduledForToday2 />} />
          <Route path="/scheduledOnSpecificDate" element={<ScheduledOn />} />
          <Route path="/viewIn" element={<ViewIn />} />
          <Route path="/users/course/:courseName" element={<GetCourse />} />

          <Route path="/users/college/:collegeName" element={<GetCollege />} />
          <Route path="/viewsubmissions" element={<ViewSubmissions />} />
          <Route path="/course/:courseName" element={<CourseStudents />} />
          <Route path="/college/:collegeName" element={<CollegeStudents />} />
          <Route path="/reschedule" element={<Reschedule />} />
          <Route path="/overallpresent" element={<OverallArrived />} />
          <Route path="/overallabsent" element={<OverallAbsent />} />
          <Route path="/yesterdaypresent" element={<YesterdayPresent />} />
        </Route>

        <Route element = {<OnlySuperAdminRoute />}>
          <Route path='/superAdminInPerson' element={<SuperAdminInPerson />} />
        </Route>
       
      </Routes>
    </BrowserRouter>
  );
}
