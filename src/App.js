import React, { Component } from "react";
import {Table } from 'reactstrap';
import request from "superagent";

class App extends Component {

    state = { 
        isLoading: false,
        customers :
        [
            {
                "Customer_id" : "1001",
                "Name" : "Saraswati",
                "isActive": "true",
                "Location": "Mumbai"
            },
            {
                "Customer_id" : "1002",
                "Name" : "Saras",
                "isActive": "true",
                "Location": "Mumbai"
            },
            {
                "Customer_id" : "1003",
                "Name" : "Sara",
                "isActive": "false",
                "Location": "Mumbai"
            }
        ]
         } 
    render() { 
        getDataFromDynamoDb();
        const isLoading = this.state.isLoading;
        const allcustomers = this.state.customers;

       
        if(isLoading){
            return(<div> Loading . . Please wait . . </div>);
        }

        let customers = allcustomers.map(customer =>
            <tr key = {customer.Customer_id}>
                <td>{customer.Customer_id}</td>
                <td>{customer.Name}</td>
                <td>{customer.isActive}</td>
                <td>{customer.Location}</td>
            </tr>
            )

        return (
            <div className="container border border-secondary rouded center">

                    <div className="row">
                     <div className="col-12">
                        <h4>Customer Information</h4>
                        </div>   
                    </div>

                    <div className="row">
                        <div className=".col-xs-12 center text-center">
                            <Table responsive striped bordered hover>
                                <thead>
                                    <th>Customer_id</th>
                                    <th>Name</th>
                                    <th>isActive</th>
                                    <th>Location</th>
                                </thead>
                                <tbody>
                                    {this.state.customers.length === 0 ? <td colSpan="4">No Records !</td>: customers}
                                </tbody>
                            </Table>

                        </div>
                    </div>
            </div>

        );

        
}
};

const getDataFromDynamoDb = () => {
    const getAllCustomers='https://2drwvskxn4.execute-api.ap-south-1.amazonaws.com/prod/getcustomers';

  request.get(`${getAllCustomers}`)
    .accept('json')
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.error(error);
    });
};
export default App;