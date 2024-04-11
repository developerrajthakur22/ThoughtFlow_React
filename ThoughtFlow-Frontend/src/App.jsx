import './App.css'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'
import "bootstrap/dist/css/bootstrap.min.css"
import Container from './Components/Container'
import { Outlet } from 'react-router-dom'
import { Provider } from "react-redux";
import {store} from "./redux/store"

function App() {

  return (
    <>
     <Provider store={store}>

        <Header />
        <div className='app-container'>
          <Sidebar />
          <Container> <Outlet /> </Container>
        </div>
     </Provider>
    </>
  )
}

export default App
