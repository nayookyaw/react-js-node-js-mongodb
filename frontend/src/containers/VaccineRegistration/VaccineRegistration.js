import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";
import DateTimePicker from '@mui/lab/DateTimePicker';
import React, { Component } from "react";

import axios from 'axios';
import {BACKEND_API} from "../../constant/global";

function getVaccineCenter() {
  return [
    { name: "None", id: 0},
    { name: "Bukit Batok CC", id: 1 },
    { name: "Bukit Panjang CC", id: 2 },
    { name: "Bukit Timah CC", id: 3 },
    { name: "Outram Park Polyclinic", id: 4 },
  ];
}

export class VaccineRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nricNo: "",
      fullName: "",
      email: "",
      selectedCenter: 0,
      date: new Date(),
      errMsg: "",
      successMsg: "",
    };
    this.handleNRICNo = this.handleNRICNo.bind(this);
    this.handleFullName = this.handleFullName.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.registerBook = this.registerBook.bind(this);
  }
  handleNRICNo(event) {
    const state = this.state;
    this.setState({...state, nricNo: event.target.value});
  }
  handleFullName(event) {
    const state = this.state;
    this.setState({...state, fullName: event.target.value});
  }
  handleEmail(event) {
    const state = this.state;
    this.setState({...state, email: event.target.value});
  }
  handleSelect(event) {
    const state = this.state;
    this.setState({...state, selectedCenter: event.target.value});
  }
  handleDateChange(value) {
    const state = this.state;
    this.setState({...state, date: value});
  }
  registerBook() {
    this.setState({ errMsg: null, successMsg: null });
    const state = this.state;

    // validate the input
    if (state) {
      if (!state.nricNo) {
        this.setState({ errMsg: "NRIC Number can not be empty!" });
        return;
      } 
      else if (!state.fullName) {
        this.setState({ errMsg: "Full Name can not be empty!" });
        return;
      }
      else if (!state.email) {
        this.setState({ errMsg: "Email can not be empty!" });
        return;
      }
      else if (!state.selectedCenter) {
        this.setState({ errMsg: "Vaccine Center can not be empty!" });
        return;
      }
      else if (state.date < new Date()) {
        this.setState({ errMsg: "Only can choose future date time!" });
        return;
      }

      axios.post(BACKEND_API + `/api/add/booking`, {
        nric : this.state.nricNo,
        name : this.state.fullName,
        email : this.state.email,
        vaccine_center : this.state.selectedCenter,
        slot : this.state.date
      })
      .then(res => {
        if (res.data) {
          if (res.data.status === "success") {
            this.setState({ successMsg: res.data.message });
          } else {
            this.setState({ errMsg: res.data.message });
          }          
        }
        
      })
      .catch(error => {
        console.log (error);
      });
      
    }
  }
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box
            component="form"
            sx={{
              mt: 8,
            }}
          >
            <Typography component="h1" variant="h5">
              Book a slot
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nric"
              value={this.state.nricNo}
              onChange={this.handleNRICNo}
              label="NRIC Number"
              name="NRIC"
              autoComplete="nric"
              sx={{mb: 2}}
              autoFocus
            />
            <TextField
              required
              fullWidth
              id="name"
              value={this.state.fullName}
              onChange={this.handleFullName}
              label="Full Name"
              name="name"
              autoComplete="name"
              sx={{mb: 2}}
            />
            <TextField
              required
              fullWidth
              id="email"
              value={this.state.email}
              onChange={this.handleEmail}
              label="Please key in correct email, I haven't added email format validation "
              name="email"
              autoComplete="email"
              sx={{mb: 2}}
            />
            <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
            <Select
              labelId="vaccineCenterLabel"
              label="Vaccine Center"
              required
              fullWidth
              id="vaccineCenter"
              value={this.state.selectedCenter}
              onChange={this.handleSelect}
              sx={{mb: 2}}
            >
              {getVaccineCenter().map((v) => {
                return <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>;
              })}
            </Select>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Slot"
              value={this.state.date}
              onChange={this.handleDateChange}
              required
            />
            <Button
              type="Button"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.registerBook}
            >
              Register!
            </Button>

            { this.state.errMsg ? 
              <Alert severity="error">{this.state.errMsg}</Alert>
              : null
            }
            { this.state.successMsg ?
              <Alert severity="success">{this.state.successMsg}</Alert>
              : null
            }
          </Box>

          <label>
            <div>Notes:</div>
            <span>I added new field (email) to send alert notification.</span><br/>
            <span>I am aware that I haven't checked the email format validation.</span><br/>
            <span>I manage to validate required for frontend and backend.</span><br/>
            <span>I also validated the slot time, meaningwhile user can't choose past time.</span>
          </label>
        </Container>
        
      </React.Fragment>
    );
  }
}
