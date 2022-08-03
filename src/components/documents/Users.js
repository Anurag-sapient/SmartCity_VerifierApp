import React, { useEffect, useState } from "react";
import { Table, Button } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
// import HashLoader from "react-spinners/HashLoader";
import ClipLoader from "react-spinners/ClipLoader";

export default function Users() {
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", width: 300 },
    { field: "body", headerName: "Body", width: 600 },
  ];

  const container = {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  };
  //1.) get approver list and store in options
  // using the url->https://pssk-api.azurewebsites.net/Document/ApproverTypes
  //get document and store into options parts

  //2.) get list of all users present and store into users print them
  //url->https://pssk-api.azurewebsites.net/User/List

  const [users, setUsers] = useState([]);
  let [loading, setLoading] = useState(false);
  const [approver, setApprover] = useState([]);
  const [selected, selectedApprover] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://pssk-api.azurewebsites.net/User/List`)
      .then((getData) => {
        setUsers(getData.data);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });

    //for approver types
    axios
      .get(`https://pssk-api.azurewebsites.net/Document/ApproverTypes`)
      .then((res) => {
        console.log(res.data);
        setApprover(res.data);
        selectedApprover(res.data[0].id);
      });
  }, []);
  console.log("selected", selected);
  localStorage.setItem("selected", selected);

  const approverChangeHandler = (event) => {
    selectedApprover(event.target.value);
  };

  console.log(users);

  return (
    <>
      {loading ? (
        <ClipLoader
          color="#524848"
          size={50}
          speedMultiplier={1}
          loading={loading}
        />
      ) : (
        // <HashLoader color={'#194acf'} loading={loading} size={100} />
        <div>
          <div>
            <br /><br /><br /><br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <center>
              <h3>User List</h3>
            </center>
            <h4>
              Document verifier :{" "}
              <Dropdown
                options={approver}
                approverChangeHandler={approverChangeHandler}
              />
            </h4>
          </div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map((user, id) => (
                <Table.Row>
                  <Table.Cell>{id + 1}</Table.Cell>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Link to={{ pathname: `/document/${user.id}` }}>
                      <Button color="green">Verify Docs</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  );
}
