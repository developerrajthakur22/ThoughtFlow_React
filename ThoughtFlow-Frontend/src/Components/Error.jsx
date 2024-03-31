import { Link } from "react-router-dom";

const Error = () => {

    return <>
        <h1 style={{textAlign: "center"}}>Not a valid Url</h1>
        <Link to= "/">Go back to home page</Link>
    </>

}

export default Error;