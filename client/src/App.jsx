import './App.css';
import Login from './pages/Login';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Signup from './pages/Signup';
import NavBar from './pages/NavBar';
import {ToastContainer} from "react-toastify"
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import ProtectedRoutes from './ProtectedRoute/ProtectedRoutes';
import Updatepic from './pages/Updatepic';
import UserProfile from './pages/UserProfile';


function App() {
  return (
    <>
<BrowserRouter>
<NavBar />
<ToastContainer />
<Routes>
  <Route path='/signup' element={<Signup />} />
  <Route path='/login' element={<Login />} />

  <Route path='' element={<ProtectedRoutes />} > 
  <Route path='/create-post' element={<CreatePost />} />
  <Route path='/profile' element={<Profile />} />
  <Route path='/update-pic' element={<Updatepic />} />
  <Route path='/user-profile' element={<UserProfile />} />
  <Route path='/' element={<Home />} />
  </Route>
</Routes>
</BrowserRouter>
    </>
  );
}

export default App;
