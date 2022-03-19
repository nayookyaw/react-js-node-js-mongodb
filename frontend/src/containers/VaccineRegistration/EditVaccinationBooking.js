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
import DateTimePicker from "@mui/lab/DateTimePicker";
import React, { Component } from "react";

import axios from 'axios';
import {BACKEND_API} from "../../constant/global";

function getVaccineCenter() {
  return [
    { name: "None", id: 0 },
    { name: "Bukit Batok CC", id: 1 },
    { name: "Bukit Panjang CC", id: 2 },
    { name: "Bukit Timah CC", id: 3 },
    { name: "Outram Park Polyclinic", id: 4 },
  ];
}

export class EditVaccineRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nricNo: "",
      fullName: "",
      email: "randomemail@gmail.com",
      selectedCenter: 0,
      date: new Date(),
      errMsg: "",
      successMsg: "",
      currentId: "",
    };
    this.handleNRICNo = this.handleNRICNo.bind(this);
    this.handleFullName = this.handleFullName.bind(this);
    this.getBookingDetails = this.getBookingDetails.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.updateBooking = this.updateBooking.bind(this);
  }

  componentDidMount() {
    this.getBookingDetails();
  }

  getBookingDetails () {
    var id = this.getUrlVars();
    this.setState({currentId: id});

    if (!id) {
      return;
    }

    axios.post(BACKEND_API + `/api/get/booking/detail/` + id , {})
    .then(res => {
      if (res.data) {
        if (res.data.status === "success") {
          if (res.data.data) {
            this.setState({ successMsg : res.data.message, errMsg : "" });
            this.setDetails(res.data.data);
          } else {
            this.setState({ successMsg : "", errMsg : "No Data!" });
          }
        } else {
          this.setState({ successMsg : "", errMsg : res.data.message });
        }          
      }
      
    })
    .catch(error => {
      console.log (error);
      this.setState({ successMsg : "", errMsg : error.message });
    });
  }

  getUrlVars() {
    return window.location.pathname.split("/").pop();
  }

  setDetails(data) {
    this.setState({
      nricNo: data.nric,
      fullName: data.name,
      selectedCenter: data.vaccine_center,
      date: data.slot
    });
  }

  handleNRICNo(event) {
    const state = this.state;
    this.setState({...state, nricNo: event.target.value});
  }
  handleFullName(event) {
    const state = this.state;
    this.setState({...state, fullName: event.target.value});
  }
  handleSelect(event) {
    const state = this.state;
    this.setState({ ...state, selectedCenter: event.target.value });
  }
  handleDateChange(value) {
    const state = this.state;
    this.setState({ ...state, date: value });
  }
  updateBooking() {
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
      else if (!state.currentId || state.currentId === "") {
        this.setState({ errMsg: "Current booking id is not valid!" });
        return;
      }

      axios.put(BACKEND_API + `/api/update/booking/` + state.currentId , {
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
        this.setState({ errMsg: error.message });
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
              label="NRIC Number"
              name="NRIC"
              autoComplete="nric"
              value={this.state.nricNo}
              onChange={this.handleNRICNo}
              sx={{mb: 2}}
              autoFocus
            />
            <TextField
              required
              fullWidth
              id="name"
              label="Full Name"
              value={this.state.fullName}
              onChange={this.handleFullName}
              sx={{mb: 2}}
              name="name"
              autoComplete="name"
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
                return (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                );
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
              type="button"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              color="success"
              onClick={this.updateBooking}
            >
              Update!
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
            <span>I purposely removed email in update page.</span><br/>
            <span>I added randomemail as default for that user. (just for privacy).</span><br/>
            <span>I haven't checked duplicate user in edit page (I did at register page).</span>
          </label>
        </Container>
      </React.Fragment>
    );
  }
}
