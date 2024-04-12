import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import MoreInfo from './pages/MoreInfo'
import Dashboard from './Dashboard/Dashboard'
import AnnualPe from './Dashboard/Components/Annual/AnnualPE';
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

import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import Announcement from './Dashboard/Components/Admin/Announcements/Announcement';
import CreatePost from './Dashboard/Components/Admin/Announcements/CreatePost';


export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
       
        <Route element={<PrivateRoute />}>
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
          <Route path="/dash-post" element={<DashPost />} />
        </Route>

        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/adminPE" element={<AdminPE />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
       
      </Routes>
    </BrowserRouter>
  );
}
