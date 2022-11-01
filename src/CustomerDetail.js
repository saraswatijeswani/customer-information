import React, { Component, useState, useEffect } from "react";
import { Button, Table } from "reactstrap";
import request from "superagent";

const CustomerDetail = (props) => {
  console.log(props.id);
  const getCustomerById = `https://2drwvskxn4.execute-api.ap-south-1.amazonaws.com/prod/customer?id=${props.id}`;

  const initialCustomerState = {
    isLoading: true,
    customer: {},
    error: undefined,
  };

  const [customerState, setCustomerState] = useState(initialCustomerState);

  useEffect(() => {
    request
      .get(`${getCustomerById}`)
      .accept("json")
      .then((res) => {
        setCustomerState({ isLoading: false, customer: res.text });
      })
      .catch((error) => {
        setCustomerState({
          isLoading: false,
          customer: undefined,
          error: error,
        });
        console.error(error);
      });
  }, []);

  if (customerState.isLoading) {
    return <div> Loading . . Please wait . . </div>;
  } else {
    const customer = JSON.parse(customerState.customer);

    let customerDataTabled = (
      <tr key={customer.Customerid}>
        <td>{customer.Customerid}</td>
        <td>{customer.Name}</td>
        <td>{customer.Email}</td>
        <td>{customer.isActive.toString()}</td>
        <td>{customer.Location}</td>
      </tr>
    );

    return (
      <div className="container border border-secondary rouded center">
        <div className="row">
          <div className="col-12">
            <h4>
              <center>Customer Details</center>
            </h4>
          </div>
        </div>

        <div className="row">
          <div className=".col-xs-12 center text-center">
            <Table responsive striped bordered hover>
              <thead>
                <th>Customer-id</th>
                <th>Name</th>
                <th>Email</th>
                <th>isActive</th>
                <th>Location</th>
              </thead>
              <tbody>{customerDataTabled}</tbody>
            </Table>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Button onClick={props.onGoBackClicked}>Go back</Button>
          </div>
        </div>
      </div>
    );
  }
};

export default CustomerDetail;
