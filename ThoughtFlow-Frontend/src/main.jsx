import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import Profile from './Components/Profile/Profile.jsx'
import { RouterProvider } from 'react-router-dom'
import Container from './Components/Container.jsx'
import Error from './Components/Error.jsx'
import PostContainer from './Components/Post/PostContainer.jsx'
import YourPost from './Components/your-post/YourPost.jsx'
import People from './Components/People/People.jsx'
import Login from './Components/Login/Login.jsx'
import UserDetailsProvider from './store/userContextStore.jsx'
import PostPage from './Components/your-post/PostPage.jsx'
import CheckProfile from './Components/check-Profile/CheckProfile.jsx'
import UserPost from './Components/check-Profile/UserPost.jsx'
import EditProfile from './Components/Edit-profile/EditProfile.jsx'
import SignUp from './Components/Login/SignUp.jsx'
import Notification from './Components/Notification/Notification.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Login />,
    children: [{
      path: "/",
      element: <Container />,
      children: [
        { path: "/", element: <PostContainer /> },
        { path: "/profile", element: <Profile /> },
        { path: "/your-post", element: <PostPage/> },
        { path: "/people", element: <People /> },
        { path: "/checkProfile", element: <CheckProfile/>},
        { path: "/user-post", element: <UserPost />},
        { path: "/edit-profile", element: <EditProfile/>},
        { path: "/notification", element: <Notification/>}
      ]
    }
    ]
  },
  {
    path: "/Login",
    element: <Login />
  }
  ,
  {
    path: "/signUp",
    element: <SignUp/>
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    {/* <App /> */}
    <UserDetailsProvider>
      <RouterProvider router={router} />
    </UserDetailsProvider>
  </React.StrictMode>,
)
