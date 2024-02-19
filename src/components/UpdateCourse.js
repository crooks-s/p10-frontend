// Modules
import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";
// Context
import UserContext from "../context/UserContext";
// Component
import ErrorsDisplay from "./ErrorsDisplay";
import CancelButton from "./CancelButton";

const UpdateCourse = () => {
  // React Hooks
  const [course, setCourse] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { authUser } = useContext(UserContext);
  const { id } = useParams();
  // React Refs
  const title = useRef(null);
  const description = useRef(null);
  const estimatedTime = useRef(null);
  const materialsNeeded = useRef(null);

  // Retrieve course details for a single course
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api(`/courses/${id}`, "GET", null, null);
        if (response.status === 200) {
          const data = await response.json();
          if (authUser.user.emailAddress !== data.User.emailAddress) {
            setErrors(['Unable to update. You are not the course owner.']);
          } else {
            setCourse(data);
          }
        } else if (response.status === 404) {
          navigate('/notfound');
        }
      } catch (error) {
        console.log('Error: ', error.message);
      }
    };
    fetchData();
  }, [id, navigate, authUser.user.emailAddress]);

  // Handles form submission to Update Course
  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedCourse = {
      title: title.current.value,
      description: description.current.value,
      estimatedTime: estimatedTime.current.value,
      materialsNeeded: materialsNeeded.current.value,
      userId: authUser.user.id
    };
    const credentials = {
      username: authUser.user.emailAddress,
      password: authUser.user.password
    };
    try {
      const response = await api(`/courses/${id}`, "PUT", updatedCourse, credentials);
      if (response.status === 204) {
        navigate(`/courses/${id}`);
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 401) {
        const data = await response.json();
        setErrors([data.message]);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log('Error: ', error.message);
    };
  };

  return (
    <>
      <ErrorsDisplay errors={errors.map((error => error.msg || error))} />
      <div className="wrap">
        <h2>Update Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="courseTitle"
                type="text"
                ref={title}
                defaultValue={course.title}
              />
              <p>
                By {course.User && `${course.User.firstName} ${course.User.lastName}`}
              </p>
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                ref={description}
                defaultValue={course.description}
                style={{ resize: 'none' }}
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                ref={estimatedTime}
                defaultValue={course.estimatedTime}
              />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                ref={materialsNeeded}
                defaultValue={course.materialsNeeded}
                style={{ resize: 'none' }}
              />
            </div>
          </div>
          <button className="button" type="submit">Update Button</button>
          <CancelButton />
        </form>
      </div>
    </>
  );
}

export default UpdateCourse;
