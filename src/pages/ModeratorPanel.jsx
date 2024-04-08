import React , { useContext, useEffect, useState}from "react";
import { Col, Container, ListGroup, Row, Tab } from "react-bootstrap";
import { TabContent2,TabContent5} from "../components/moderatorContent";
import axios from "axios"; 
import { AuthContext } from "../context/authContext";  


const ModeratorPanel = () => {
  const { currentUser } = useContext(AuthContext);
  const [kretsar, setKretsar] = useState({ Krets1: '', Krets2: '' });
  
  const isModerator = currentUser && currentUser.role === 2;

  useEffect(() => {
    if (isModerator) {
      fetchKretsar(currentUser.id);
    } else {
      window.location.href = "/";
    }
  }, [currentUser, isModerator]);

  const fetchKretsar = async (userId) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/moderators/krestar/${userId}`;
      const res = await axios.get(apiUrl);
      setKretsar(res.data);
    } catch (err) {
      console.error("Error fetching moderator krestars:", err);
    }
  };

  const tabItems = [
    { id: '#link1', title: 'INLÄGG/AKTIVITET' },
    { id: '#link2', title: kretsar.Krets1 || 'Kretsar1', content: <TabContent2 kretsar={kretsar.Krets1}/> },
    { id: '#link3', title: kretsar.Krets2 || 'Kretsar2', content: <TabContent2 kretsar={kretsar.Krets2}/> },
  ];
  
  const tabItems2 = [
    { id: '#link4', title: 'Användarna' },
    { id: '#link5', title: 'Alla användare', content: <TabContent5/> },
  ];
  
  // Define the array containing non-clickable link IDs
  const nonClickableLinks = ['#link1', '#link4'];
  

  return (
    <Container className="conLayout">
      <h1>Moderator Dashboard</h1>
    <Tab.Container id="list-group-tabs" defaultActiveKey="#link1">
    <Row className="rowClass">
      <Col className="col1Class" sm={3}>
        <ListGroup className="groupClass">
        {tabItems.map(item => (
                <ListGroup.Item 
                key={item.id} 
                className={`list-group-item list-group-item-success ${nonClickableLinks.includes(item.id) ? "non-clickable" : ""}`}
                {...(nonClickableLinks.includes(item.id) ? {} : { action: true, href: item.id })}
                >
                  {item.title}
                </ListGroup.Item>
              ))}
              {tabItems2.map(item => (
                <ListGroup.Item 
                key={item.id} 
                className={`list-group-item list-group-item-secondary ${nonClickableLinks.includes(item.id) ? "non-clickable" : ""}`}
                {...(nonClickableLinks.includes(item.id) ? {} : { action: true, href: item.id })}
                >
                  {item.title}
                </ListGroup.Item>
              ))}
        </ListGroup>
      </Col>
      <Col className="col2Class" sm={9}>
      <Tab.Content>
              {tabItems.map(item => (
                <Tab.Pane key={item.id} eventKey={item.id}>
                  {item.content}
                </Tab.Pane>
              ))}
              {tabItems2.map(item => (
                <Tab.Pane key={item.id} eventKey={item.id}>
                  {item.content}
                </Tab.Pane>
              ))}
            </Tab.Content>
      </Col>
    </Row>
    </Tab.Container>
    </Container>

  );
};

export default ModeratorPanel;