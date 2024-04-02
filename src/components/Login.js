import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    // const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });
            const json = await response.json();
            console.log(json);
            if (json.success) {
                localStorage.setItem('token', json.token);
                // history.push("/"); // Redirect to home page
                props.showAlert("Login successful", "success");
            } else {
                props.showAlert("Invalid credentials", "danger");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            props.showAlert("Error logging in", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div>
            <form className='container' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} id="exampleInputEmail1" name='email' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} name='password' onChange={onChange} id="password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login;