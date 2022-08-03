import React, { useEffect, useState } from "react";
import { Table, Button } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useParams } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-bootstrap/Modal";

export default function Document() {
  const [doc, setDoc] = useState([]);
  const [approver, setApprover] = useState([]);
  const [selected, selectedApprover] = useState(null);
  const [user, setUser] = useState([]);
  let [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selDoc, setSelDoc] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  let { id } = useParams();
  console.log("selected approver type :", localStorage.getItem("selected"));
  
  // selectedApprover(selid);

  //getting base64 and setting select doc
  const showModal = (item) => {
    setModalLoading(true)
    axios
      .get(
        `https://pssk-api.azurewebsites.net/Document/Base64?documentName=${item.name}&userId=${id}`
      )
      .then((res) => {
        setSelDoc(res.data);
        setModalLoading(false)
      });
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let selid = localStorage.getItem("selected");
    setLoading(true);
    axios
      .get(`https://pssk-api.azurewebsites.net/User?userId=${id}`)
      .then((res) => {
        setUser(res.data);
        axios
          .get(
            `https://pssk-api.azurewebsites.net/Document?userId=${id}&approverTypeId=${selid}`
          )
          .then((res) => {
            setDoc(res.data);
            setLoading(false);
          })
          .catch((e) => {
            console.log("error from document:", e);
            setLoading(false);
          });
      })
      .catch((e) => {
        console.log("error from document:", e);
        setLoading(false);
      });
      console.log("documents are :",doc.length)
    // axios.get(`https://pssk-api.azurewebsites.net/Document/ApproverTypes`)
    //     .then((res) => {
    //         console.log(res.data);
    //         setApprover(res.data)
    //         selectedApprover(res.data[0].id)
    //         //to get username and email
    //         axios.get(`https://pssk-api.azurewebsites.net/User?userId=${id}`)
    //             .then((res) => {
    //                 setUser(res.data);

    //             })
    //     })
  }, []);

  // console.log('selected', selected)

  // const approverChangeHandler = (event) => {
  //     selectedApprover(event.target.value);
  // }

  const statusChangeHandler = (type, item) => {
    let selid = localStorage.getItem("selected");
    setLoading(true);
    axios({
      method: "POST",
      url: "https://pssk-api.azurewebsites.net/Document/Review",
      data: {
        documentName: item.name,
        userId: id,
        statusId: type,
      },
    })
      .then((res) => {
        axios
          .get(`https://pssk-api.azurewebsites.net/Document?userId=${id}&approverTypeId=${selid}`)
          .then((res) => {
            setDoc(res.data);
            setLoading(false);
          });
      })
      .catch((err) => console.log("eeerr", err));
  };

  //1) get document types->
  // url-https://pssk-api.azurewebsites.net/Document/DocumentTypes

  //2) get document for user with particular userid which we got from user list
  // url - https://pssk-api.azurewebsites.net/Document?userId=1

  //3)post review document id-2-approve ,3-reject
  // url-

  // 4)based on review verified / pending document
  // url-

  return (
    <>
      {loading ? (
        // <HashLoader color={"#194acf"} loading={loading} size={100} />
        <ClipLoader
          color="#524848"
          size={50}
          speedMultiplier={1}
          loading={loading}
        />
      ) : (
        <>
          <Modal show={isOpen} onHide={hideModal}>
            <Modal.Header>
              <Modal.Title>Document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {modalLoading ? (
               <center> <ClipLoader color="#524848" size={50} speedMultiplier={1}/></center>
              ) : (
                <img src={selDoc} width="200" alt="view doc img"/>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button color="blue" onClick={hideModal}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
          <div>
            {/* <h4>Document verifier  :  <Dropdown options={approver} approverChangeHandler={approverChangeHandler} /></h4> */}
            <center>
              <h1>Document Verification</h1>
            </center>
            <br />
            <h3>
              UserName: <span style={{color: 'blue'}}>{user.firstName} {user.lastName}</span> <br />
              <br /> User Email: <span style={{color: 'blue'}}>{user.email}</span>
            </h3>
            <br />
          </div>
          <div>
            {!doc.length?<center><span style={{color: 'red'}}><h3 ><br/>This Document is not Yet Uploaded by the User</h3></span><br/></center>
            :
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Document Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Preview Doc</Table.HeaderCell>
                  <Table.HeaderCell>Approve Doc</Table.HeaderCell>
                  <Table.HeaderCell>Reject Doc</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {doc.map((item, id) => (
                  <Table.Row key={id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>
                      {item.documentType ? item.documentType?.type : "N/A"}
                    </Table.Cell>
                    <Table.Cell>
                      <p color="purple">{item.status}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <Button color="blue" onClick={() => showModal(item)}>
                        View
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="green"
                        disabled={item.statusId != 1 ? true : false}
                        onClick={() => statusChangeHandler(2, item)}
                      >
                        Approve
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="red"
                        disabled={item.statusId != 1 ? true : false}
                        onClick={() => statusChangeHandler(3, item)}
                      >
                        Reject
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            }
            <br />
            <center>
              <Link to="/">
                <Button color="grey">Back</Button>
              </Link>
            </center>
          </div>
        </>
      )}
    </>
  );
}
