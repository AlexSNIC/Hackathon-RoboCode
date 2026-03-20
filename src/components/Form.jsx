import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection } from "firebase/firestore";

// ADD YOUR FIREBASE CONFIG AND UNCOMMENT THE BELLOW LINES TO ENABLE FORM FUNCTIONALITY
// import { db } from "../firebaseConfig";
async function addMessage(data){
  // const col = collection(db, "msg");
  // try{
  //   await addDoc(col, data);
  // }
  // catch(err){
  //   throw new Error(err);
  // }
  alert("Form functionality is disabled on download from github. Please contact us via email or social media links below. To test the form, add your Firebase config in src/firebaseConfig.js and uncomment the relevant lines in src/components/Form.jsx");
}

const Form = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem("PF_FORM_NAME");
    const savedEmail = localStorage.getItem("PF_FORM_EMAIL");
    const savedMessage = localStorage.getItem("PF_FORM_MESSAGE");

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedMessage) setMessage(savedMessage);
  }, []);

  function changeName(e) {
    setName(e.target.value);
    e.target.style.backgroundColor = "#25282B";
    localStorage.setItem("PF_FORM_NAME", e.target.value);
  }

  function changeEmail(e) {
    setEmail(e.target.value);
    e.target.style.backgroundColor = "#25282B";
    localStorage.setItem("PF_FORM_EMAIL", e.target.value);
  }

  function changeMessage(e) {
    setMessage(e.target.value);
    e.target.style.backgroundColor = "#25282B";
    localStorage.setItem("PF_FORM_MESSAGE", e.target.value);
  }

  function validData(){
    let validateErrorMessage = null;

    if(name === ""){
      nameRef.current.style.backgroundColor = "#B22222";
      validateErrorMessage = "Please fill in all fields";
    }
    if(email === ""){
      emailRef.current.style.backgroundColor = "#B22222";
      validateErrorMessage = "Please fill in all fields";
    }
    if(message === ""){
      messageRef.current.style.backgroundColor = "#B22222";
      validateErrorMessage = "Please fill in all fields";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      emailRef.current.style.backgroundColor = "#B22222";
      validateErrorMessage = "Please enter a valid email";
    }
    if(validateErrorMessage !== null){
      setTimeout(() => alert(validateErrorMessage), 0);
      return false;
    }
    return true;
  }
  function submitForm(e) {
    e.preventDefault();
    if(!validData()) return;

    buttonRef.current.setAttribute("disabled", true);
    const data = {name, email, message};
    addMessage(data)
    .then(() => {
      buttonRef.current.removeAttribute("disabled");
      setName("");
      setEmail("");
      setMessage("");
      localStorage.setItem("PF_FORM_NAME", "");
      localStorage.setItem("PF_FORM_EMAIL", "");
      localStorage.setItem("PF_FORM_MESSAGE", "");
      alert("Data sent successfully!")
    })
    .catch(err => {
      console.error(err);
      buttonRef.current.removeAttribute("disabled");
      alert("Could not send data. Please try again later");
      });
  }
  return (
    <form {...props} className='form' onSubmit={submitForm}>
      <h2 style={{textAlign: 'center'}}>Contact us via form:</h2>
      <label className='form__label' htmlFor="form-name">Name: </label>
      <input
        className='form__field'
        type="text"
        id='form-name'
        ref={nameRef}
        onChange={changeName}
        value={name}
      />
      <label className='form__label' htmlFor="form-email">Email: </label>
      <input
        className='form__field'
        type="text"
        id='form-email'
        ref={emailRef}
        onChange={changeEmail}
        value={email}
      />
      <label className='form__label' htmlFor="form-message">Message: </label>
      <textarea
        className='form__textarea'
        id="form-message"
        ref={messageRef}
        onChange={changeMessage}
        value={message}
        cols="30"
        rows="10"
      ></textarea>
      <button className='button__dark form__submit' ref={buttonRef} type="submit">Send</button>
    </form>
  );
};

export default Form;