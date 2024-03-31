import './App.css'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'
import Post from './Components/Post/Post'
import "bootstrap/dist/css/bootstrap.min.css"
import Container from './Components/Container'
import { Outlet } from 'react-router-dom'
import UserDetailsProvider from './store/userContextStore'

function App() {

  return (
    <>
        <Header />
        <div className='app-container'>
          <Sidebar />
          <Container> <Outlet /> </Container>
        </div>
    </>
  )
}

export default App
