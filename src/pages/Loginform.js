// import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField } from "@mui/material";
import { Button, Dialog, DialogActions, DialogContent, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link, useHistory } from "react-router-dom";
import "../styles.css";
import { useAuth } from '../authentication/AuthContext';

var valusername ="";


const Loginform = () => {
  // export default class Loginform extends Component {

          // React States
    const [errorMessages, setErrorMessages] = useState({});
    const [open,openchange]=useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const history=useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
      name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
      // <div style={{color:'red',fontSize: "13px",fontStyle: "italic"}}>{errorMessages.message}</div>
      );
    
  
    const handleSubmit = async (e) => {
      //Prevent page reload
      e.preventDefault();
      setLoading(true);
      setError('');

      var { uname, pass } = document.forms[0];
      const result = await login(uname.value, pass.value);

      if (!result.success) {
        setError(result.error);
        setErrorMessages({ name: "erorname", message: result.error});
        setLoading(false);
      }
      else {
        setLoading(false);
        setIsSubmitted(true);
        // alert("data user autcontext: "+JSON.stringify(user.username))
        // localStorage.setItem('user', user.username);
        
        history.push('/home');
      }
      
    };

    const renderForm = (
      <div className="form">
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
          <Stack spacing={2} margin={2}>    {/*  myfootstep    */}
              {/* textfield for manual input >>*/}  
              <TextField variant="outlined" label="UserName" input type="text" name="uname" required></TextField>
              {renderErrorMessage("uname")}
              <TextField variant="outlined" label="Password" input type="password" name="pass" required></TextField>
              {renderErrorMessage("pass")}

              {/* textfield for auto input >>*/} 
              {/* <TextField variant="outlined" label="UserName" input type="text" value={valusername} name="uname" required></TextField> 
              {renderErrorMessage("uname")}
              <TextField variant="outlined" label="Password" input type="password" name="pass" required ></TextField>
              {renderErrorMessage("pass")} */}

              {/* <Button color="primary" input type="submit" variant="contained">OK</Button> */}
              <button color="primary" input type="submit" variant="contained" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
          </Stack>
          </form>
      </div>
    );

    const functionopenpopup=()=>{
    openchange(true);
    }
    const functionopenpopup1=()=>{
        openchange(true);
        var button1 = document.getElementById("button1");
        valusername = button1.value
    }
    const functionopenpopup2=()=>{
        openchange(true);
        var button2 = document.getElementById("button2");
        valusername = button2.value
    }
    const closepopup=()=>{
        openchange(false);
        valusername = ""
    }


    return (
    <div style={{textAlign:'center'}}>
      <div class="wrapper">
        <div class="center">
            <h1>Please Login</h1> 
            {/* <Button onClick={functionopenpopup} color="primary" variant="contained">login</Button> */}
            <div className="buttons"> 
              {/* for auto input >> */}
              {/* <Button onClick={functionopenpopup1} id="button1" value="cashier" >CASHIER</Button>
              <Button onClick={functionopenpopup2} id="button2" value="customer" class="btn2" >CUSTOMER</Button> */}
              
              {/* for manual input >> */}
              <Button onClick={functionopenpopup} >LOGIN</Button>
            </div>
            
            <Dialog
            // fullScreen
            open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        {/* <div className="app"> */}
                            {/* {isSubmitted ? navigate('/home') : renderForm} */}
                            {isSubmitted ? <div>Redirecting...</div> : renderForm}
                        {/* </div> */}

                    </Stack>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </div>
      </div>
    </div>
    )
}

export default Loginform;


