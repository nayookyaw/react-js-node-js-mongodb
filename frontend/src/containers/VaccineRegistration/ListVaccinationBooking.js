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
} from "@mui/material";
import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { Component } from "react";

import axios from 'axios';
import moment from 'moment'
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

export class VaccineRegistrationListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingList: [],
    };
    this.getBooking = this.getBooking.bind(this);
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
                  {this.state.bookingList.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        {row.email.toString()}
                      </TableCell>
                      <TableCell align="left">
                        {
                          getVaccineCenter().find(v => v.id === parseInt(row.vaccine_center)) ? 
                          getVaccineCenter().find(v => v.id === parseInt(row.vaccine_center)).name : "uknown center"
                        }
                      </TableCell>
                      <TableCell align="left">
                        {moment((row.slot)).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to={'/bookings/' + row.id}>
                          <ModeEditIcon />
                        </Button>
                        <Button>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
