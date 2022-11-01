import React, { Component, useState, useEffect } from "react";
import { Table } from "reactstrap";
import request from "superagent";
import CustomerDetail from "./CustomerDetail";

const CustomerList = () => {
  const getAllCustomers =
    "https://2drwvskxn4.execute-api.ap-south-1.amazonaws.com/prod/getcustomers";

  const initialCustomerState = {
    isLoading: true,
    isShowingDetailView: false,
    detailViewCustomerId: -1,
    customers: [],
    error: undefined,
  };

  const [customerState, setCustomerState] = useState(initialCustomerState);

  useEffect(() => {
    request
      .get(`${getAllCustomers}`)
      .accept("json")
      .then((res) => {
        setCustomerState({
          ...initialCustomerState,
          isLoading: false,
          customers: res.text,
        });
      })
      .catch((error) => {
        setCustomerState({
          ...initialCustomerState,
          isLoading: false,
          error: error,
        });
        console.error(error);
      });
  }, []);

  const showDetailView = (customerId) => {
    console.log("DetailView requested");
    setCustomerState({
      ...customerState,
      detailViewCustomerId: Number(customerId),
      isShowingDetailView: true,
      customerId: Number(customerId),
    });
  };

  if (customerState.isLoading) {
    return <div> Loading . . Please wait . . </div>;
  } else if (customerState.isShowingDetailView) {
    return (
      <div className="container border border-secondary rouded center">
        <CustomerDetail
          id={customerState.detailViewCustomerId}
          onGoBackClicked={() => {
            setCustomerState({
              ...customerState,
              isShowingDetailView: false,
              detailViewCustomerId: -1,
            });
          }}
        />
      </div>
    );
  } else {
    const allcustomers = JSON.parse(customerState.customers);
    console.log("All", allcustomers.customers);
    let customers = allcustomers.customers.map((customer) => (
      <tr
        key={customer.Customerid}
        onClick={() => {
          showDetailView(customer.Customerid);
        }}
      >
        <td>{customer.Customerid}</td>
        <td>{customer.Name}</td>
      </tr>
    ));

    return (
      <div className="container border border-secondary rouded center">
        <div className="row">
          <div className="col-12">
            <h4>
              <center>Customer(s) List</center>
            </h4>
          </div>
        </div>

        <div className="row">
          <div className=".col-xs-12 center text-center">
            <Table responsive striped bordered hover>
              <thead>
                <th>Customer-id</th>
                <th>Name</th>
              </thead>
              <tbody>
                {customerState.customers.length === 0 ? (
                  <td colSpan="4">No Records !</td>
                ) : (
                  customers
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
};

export default CustomerList;
