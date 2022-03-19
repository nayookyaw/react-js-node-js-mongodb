import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
  Modal,
  Alert,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { Component } from "react";

import axios from 'axios';
import moment from 'moment';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export class VaccineRegistrationListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingList: [],
      deleteModal: false,
      currentDetail: "",
      errMsg: "",
      successMsg: "",
    };
    this.getBooking = this.getBooking.bind(this);
    this.deleteBookingToggle = this.deleteBookingToggle.bind(this);
    this.deleteBooking = this.deleteBooking.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
  }

  componentDidMount() {
    this.getBooking();
  }

  getBooking() {
    axios.post(BACKEND_API + `/api/get/all/booking/`, {})
    .then(res => {
      if (res.data) {
        if (res.data.status === "success") {
          if (res.data.data) {
            this.setState({ bookingList: res.data.data});
            this.setState({ successMsg: res.data.message });
          } else {
            this.setState({ bookingList : [] });
          }
        } else {
          console.log ("error");
        }          
      }
      
    })
    .catch(error => {
      console.log (error);
    });
  }

  deleteBookingToggle () {
    this.setState({ deleteModal: !this.state.deleteModal });
  }
  deleteBooking (bookingDetail) {
    this.setState({ errMsg: null, successMsg: null });

    this.setState({
      deleteModal: true,
      currentDetail: bookingDetail
    });
  }
  deleteConfirm() {
    const currentId = this.state.currentDetail.id;
    axios.delete(BACKEND_API + `/api/delete/booking/` + currentId , {})
    .then(res => {
      if (res.data) {
        if (res.data.status === "success") {
          this.setState({ 
            successMsg: res.data.message,
            deleteModal: false,
          });
          setTimeout(this.getBooking, 1500);
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
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Active Booking
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Email</TableCell>
                    <TableCell align="center">Center Name</TableCell>
                    <TableCell align="center">Booking Time</TableCell>
                    <TableCell align="center">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.bookingList.map((booking) => (
                    <TableRow
                      key={booking.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {booking.name}
                      </TableCell>
                      <TableCell align="left">
                        {booking.email.toString()}
                      </TableCell>
                      <TableCell align="left">
                        {
                          getVaccineCenter().find(v => v.id === parseInt(booking.vaccine_center)) ? 
                          getVaccineCenter().find(v => v.id === parseInt(booking.vaccine_center)).name : "uknown center"
                        }
                      </TableCell>
                      <TableCell align="left">
                        {moment((booking.slot)).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to={'/bookings/' + booking.id}>
                          <ModeEditIcon />
                        </Button>
                        <Button>
                          <DeleteIcon color="error" onClick={this.deleteBooking.bind(this, booking)}/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          { this.state.errMsg ? 
            <Alert severity="error">{this.state.errMsg}</Alert>
            : null
          }
          { this.state.successMsg ?
            <Alert severity="success">{this.state.successMsg}</Alert>
            : null
          }
        </Container>
        {/* Delete Booking Modal */}
        <Modal
          open={this.state.deleteModal}
          onClose={this.deleteBookingToggle}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure to delete booking ?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button sx={{ color: 'primary.main' }} onClick={this.deleteBookingToggle}>Cancel</Button>{' '}
              <Button sx={{ color: 'error.main' }} onClick={this.deleteConfirm}>Delete</Button>
            </Typography>
          </Box>
        </Modal>
      </React.Fragment>
    );
  }
}
