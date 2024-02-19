// Modules
import { useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Context
import UserContext from "../context/UserContext";
import ErrorsDisplay from "./ErrorsDisplay";
// Component
import CancelButton from "./CancelButton";

const UserSignIn = () => {
  // React Hooks
  const navigate = useNavigate();
  const { actions } = useContext(UserContext);
  const [errors, setErrors] = useState([]);
  // React Refs
  const emailAddress = useRef(null);
  const password = useRef(null);

  // Handle form submission to Sign in with user's entered credentials
  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = {
      emailAddress: emailAddress.current.value,
      password: password.current.value
    };
    try {
      const user = await actions.signIn(credentials);
      if (user) {
        navigate('/');
      } else if (user === null) {
        setErrors(['Not authorized. Invalid credentials.']);
      }
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  return (
    <div className="form--centered">
      <ErrorsDisplay errors={errors} />
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          ref={emailAddress}
          placeholder="email@example.com"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          ref={password}
          placeholder="8-20 characters"
        />
        <button className='button' type="submit">Sign In</button>
        <CancelButton />
      </form>
      <p>Don't have a user account? Click here to
        <Link to="/signup"> sign up</Link>!
      </p>
    </div>
  );
}

export default UserSignIn;
