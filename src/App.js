import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './theme/GlobalStyle';
import './styles/modals.css';
import { theme } from './theme/theme';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import EditProfile from './Pages/Profile/EditProfile';
import FriendsId from './Pages/FriendsId/FriendsId';
import Notification from './Pages/Notification/Notification';
import Login from './Pages/RegisterPage/Login';
import ImgBox from './Pages/Ex/Ex';
import SignUp from './Pages/RegisterPage/SignUp';
import Medi from './Pages/Medication/Medi';
import MediHome from './Pages/Medication/MediHome';
import Friend from './Pages/Friend/Friend';
import ImprovedFriendPage from './Pages/Friend/ImprovedFriendPage';
import ImprovedFindFriendsPage from './Pages/FindFriend/ImprovedFindFriendsPage';
import Ex from './Pages/Ex/Ex';
import DD from './Pages/Ex/DD';
import Compare from './Pages/Compare/Compare';
import NHome from './Pages/NHome/NHome';
import Caregiver from './Pages/Caregiver/Caregiver';
import { UserProvider } from './context/UserContext';
import Buddy from './Pages/WalkingBuddy/Buddy';
import Trip from './Pages/Trip/Trip';
import Event from './Pages/Event/Event';
import FindFriendlist from './Pages/FindFriend/FindFriendlist';
import GroupHome from './Pages/Groups/GroupHome/GroupHome';
import GroupProfile from './Pages/Groups/Profile/GroupProfile';
import AuthRequired from './Components/auth/AuthRequired';
import Chat from './Pages/Chat/ChatBox';
import Vide from './Pages/Vide';

// Create protected components
const ProtectedHome = AuthRequired(Home);
const ProtectedProfile = AuthRequired(Profile);
const ProtectedEditProfile = AuthRequired(EditProfile);
const ProtectedFriendsId = AuthRequired(FriendsId);
const ProtectedNotification = AuthRequired(Notification);
const ProtectedMedi = AuthRequired(Medi);
const ProtectedMediHome = AuthRequired(MediHome);
const ProtectedCaregiver = AuthRequired(Caregiver);
const ProtectedFriend = AuthRequired(ImprovedFriendPage);
const ProtectedImgBox = AuthRequired(ImgBox);
const ProtectedEx = AuthRequired(Ex);
const ProtectedBuddy = AuthRequired(Buddy);
const ProtectedCompare = AuthRequired(Compare);
const ProtectedNHome = AuthRequired(NHome);
const ProtectedFindFriendlist = AuthRequired(ImprovedFindFriendsPage);
const ProtectedGroupHome = AuthRequired(GroupHome);
const ProtectedGroupProfile = AuthRequired(GroupProfile);
const ProtectedDD = AuthRequired(DD);
const ProtectedEvent = AuthRequired(Event);
const ProtectedTrip = AuthRequired(Trip);
const ProtectedChat = AuthRequired(Chat);
const ProtectedVide = AuthRequired(Vide);

const App = () => {
  const [friendProfile, setFriendsProfile] = useState([]);
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <UserProvider>
        <div className='App'>
          <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />

          {/* Protected Routes */}
          <Route path='/home' element={<ProtectedHome setFriendsProfile={setFriendsProfile} />} />
          <Route path='/profile' element={<ProtectedProfile />} />
          <Route path='/profile/edit/:username' element={<ProtectedEditProfile />} />
          <Route path='/profile/:username' element={<ProtectedProfile />} />
          <Route path='/friendsId' element={<ProtectedFriendsId friendProfile={friendProfile} />} />
          <Route path='/notification' element={<ProtectedNotification />} />
          <Route path='/med' element={<ProtectedMedi />} />
          <Route path='/medication' element={<ProtectedMediHome />} />
          <Route path='/caregiver' element={<ProtectedCaregiver />} />
          <Route path='/friend' element={<ProtectedFriend />} />
          <Route path='/friends' element={<ProtectedFriend />} />
          <Route path='/image' element={<ProtectedImgBox />} />
          <Route path='/ex' element={<ProtectedEx />} />
          <Route path='/walk' element={<ProtectedBuddy />} />
          <Route path='/comparebox' element={<ProtectedCompare />} />
          <Route path='/compare/:username' element={<ProtectedCompare />} />
          <Route path='/nhome' element={<ProtectedNHome />} />
          <Route path='/findfrined' element={<ProtectedFindFriendlist />} />
          <Route path='/find-friends' element={<ProtectedFindFriendlist />} />
          <Route path='/groups' element={<ProtectedGroupHome />} />
          <Route path='/group/:username' element={<ProtectedGroupProfile />} />
          <Route path='/DD' element={<ProtectedDD />} />
          <Route path='/event' element={<ProtectedEvent />} />
          <Route path='/trip' element={<ProtectedTrip />} />
          <Route path='/chat/:fnd' element={<ProtectedChat />} />
          <Route path='/chat' element={<ProtectedChat />} />
          <Route path='/Vide' element={<ProtectedVide />} />
        </Routes>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
