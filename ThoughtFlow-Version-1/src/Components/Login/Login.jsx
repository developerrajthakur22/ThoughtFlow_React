import React, { useState, useContext } from 'react';
import Logo from "../../assets/logo.png";
import { userContext } from '../../store/userContextStore';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../Utility/global';

const Login = () => {

    //Context api for storing user data in context
    const userDetailsContext = useContext(userContext);

    //React route dom to navigate to home page "/"
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Calling api with username and password
        callLoginApi(username, password);
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        if (name == "username") {
            setUsername(value);
        }
        else if (name == "password") {
            setPassword(value);
        }
    }

    //API for JWT
    const callLoginApi = (username, password) => {
        const encodedCredentials = btoa(`${username}:${password}`);
        fetch(`${BASE_URL}/loginTF`, {
            headers: {
                Authorization: `Basic ${encodedCredentials}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Extract token from response
                let token = response.headers.get("Authorization");
                //Store jwt in cookie
                document.cookie = `jwtToken=${token}; path=/`;
                // Split token into parts
                const [header, payload, signature] = token.split('.');
                // Decode payload (user ID is typically stored here)
                const decodedPayload = JSON.parse(atob(payload));
                const userId = decodedPayload.userId;
                // Fetch user details using user ID
                userDetailsContext.fetchUserDetails(userId);
                navigate("/");
                console.log("Navigated");
            })
            .catch(error => {
                console.error('Error logging in:', error);
                alert("Invalid credentials")
                // Handle error
            });
    }

    return (
        <div className="d-flex align-items-center py-4 bg-body-tertiary" style={{ width: "40%", margin: "50px auto", padding: "5%" }}>
            <main className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>
                    <img className="mb-4" src={Logo} alt="" width="210" height="60" style={{ borderRadius: "40px" }} />
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                    <div className="form-floating">
                        <input className="form-control" id="floatingInput" placeholder="name@example.com" name='username' onChange={onChangeHandler} />
                        <label htmlFor="floatingInput">Username or Email</label>
                    </div>
                    <br />
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name='password' onChange={onChangeHandler} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-check text-start my-3">
                        {/* <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                        Remember me
                    </label> */}
                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                    <button type="button" class="btn btn-link" onClick={() => navigate("/signUp")}>Signup</button>

                </form>
            </main>
            <script src="/docs/5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
        </div>
    );
}

export default Login;
