import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, ListGroup, ProgressBar, Alert, Badge, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxOpen, faShoppingBag, faUsers, faChartLine, faBell, 
  faHeadset, faRocket, faLightbulb, faCog, faUserCircle,
  faStore, faCalendarAlt, faMoneyBillWave, faTags
} from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './OwnerHomePage.css'; // Custom CSS file

const OwnerHomePage = () => {
  // Initialize AOS (Animate On Scroll) inside useEffect
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: true
    });
  }, []); // Empty dependency array ensures this runs only once

  // Quick access cards data
  const quickAccessCards = [
    { 
      title: 'Manage Products', 
      description: 'Add, edit, or remove products from your inventory', 
      icon: faBoxOpen,
      link: '/products',
      badge: { text: '3 New', variant: 'danger' }
    },
    { 
      title: 'View Orders', 
      description: 'Track and manage customer orders', 
      icon: faShoppingBag,
      link: '/orders',
      badge: { text: '12 Pending', variant: 'warning' }
    },
    { 
      title: 'Customer Insights', 
      description: 'Analyze customer behavior and preferences', 
      icon: faUsers,
      link: '/customers',
      badge: { text: 'Updated', variant: 'success' }
    },
    { 
      title: 'Sales Reports', 
      description: 'Generate detailed sales analytics', 
      icon: faChartLine,
      link: '/reports',
      badge: { text: 'New Feature', variant: 'info' }
    }
  ];

  // Sales data with more metrics
  const salesData = {
    current: 50000,
    target: 65000,
    percentage: 75,
    trend: 'up',
    comparison: '15% higher than last month',
    metrics: [
      { name: 'Online Sales', value: 32000, change: '+12%' },
      { name: 'In-Store', value: 18000, change: '+5%' },
      { name: 'New Customers', value: 142, change: '+8%' },
      { name: 'Repeat Customers', value: 89, change: '+22%' }
    ]
  };

  // Notifications with categories
  const notifications = [
    { id: 1, text: 'New order received: #10234', time: '5 mins ago', urgent: true, category: 'orders' },
    { id: 2, text: 'Low stock alert: Product XYZ', time: '2 hours ago', urgent: true, category: 'inventory' },
    { id: 3, text: 'Customer inquiry pending response', time: '1 day ago', urgent: false, category: 'support' },
    { id: 4, text: 'New customer review received', time: '1 day ago', urgent: false, category: 'feedback' },
    { id: 5, text: 'Scheduled maintenance tonight at 2 AM', time: '3 days ago', urgent: false, category: 'system' }
  ];

  // Recent activities timeline
  const recentActivities = [
    { id: 1, action: 'Updated product pricing', user: 'You', time: 'Just now', icon: faTags },
    { id: 2, action: 'Processed order #10233', user: 'Staff Member', time: '30 mins ago', icon: faShoppingBag },
    { id: 3, action: 'Added new product', user: 'You', time: '2 hours ago', icon: faBoxOpen },
    { id: 4, action: 'Generated monthly report', user: 'System', time: '5 hours ago', icon: faChartLine }
  ];

  // Performance metrics
  const performanceMetrics = [
    { name: 'Conversion Rate', value: '3.2%', change: '+0.4%', positive: true },
    { name: 'Avg. Order Value', value: '$89.50', change: '+$5.20', positive: true },
    { name: 'Customer Satisfaction', value: '4.7/5', change: '-0.1', positive: false },
    { name: 'Inventory Turnover', value: '2.1x', change: '+0.3x', positive: true }
  ];

  return (
    <Container fluid className="p-4 owner-homepage">
      {/* Header with User Dropdown */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="mb-0">
            <FontAwesomeIcon icon={faStore} className="text-primary me-2" />
            Dashboard Overview
          </h2>
        </Col>
        <Col md={6} className="text-md-end">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="user-dropdown">
              <FontAwesomeIcon icon={faUserCircle} className="me-2" />
              Owner Account
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                My Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Quick Stats Row */}
      <Row className="mb-4 g-4" data-aos="fade-up">
        {[
          { 
            title: "Today's Sales", 
            value: "$2,450", 
            change: "12%", 
            icon: faMoneyBillWave, 
            color: "primary",
            trend: "up"
          },
          { 
            title: "New Orders", 
            value: "18", 
            change: "5%", 
            icon: faShoppingBag, 
            color: "success",
            trend: "up"
          },
          { 
            title: "Customers", 
            value: "1,245", 
            change: "2%", 
            icon: faUsers, 
            color: "warning",
            trend: "down"
          },
          { 
            title: "Inventory", 
            value: "342 Items", 
            change: "15 low stock", 
            icon: faBoxOpen, 
            color: "info",
            trend: null
          }
        ].map((stat, index) => (
          <Col xl={3} md={6} key={`stat-${index}`}>
            <Card className={`stat-card shadow-sm border-start border-5 border-${stat.color}`}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-uppercase text-muted mb-2">{stat.title}</h6>
                    <h3 className="mb-0">{stat.value}</h3>
                  </div>
                  <div className={`icon-circle bg-${stat.color}-light`}>
                    <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color}`} />
                  </div>
                </div>
                <p className={`mt-3 mb-0 text-${stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'danger' : 'muted'}`}>
                  {stat.trend && <FontAwesomeIcon icon={faChartLine} className={`me-1 ${stat.trend === 'down' ? 'flip-vertical' : ''}`} />}
                  <span className="fw-bold">{stat.change}</span> {stat.trend === 'up' ? 'increase' : stat.trend === 'down' ? 'decrease' : ''}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Row */}
      <Row className="g-4">
        {/* Left Column */}
        <Col lg={8}>
          {/* Sales Overview Section */}
          <Card className="mb-4 shadow-sm" data-aos="fade-up">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <FontAwesomeIcon icon={faChartLine} className="text-primary me-2" />
                  Sales Performance
                </Card.Title>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    This Month
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Today</Dropdown.Item>
                    <Dropdown.Item>This Week</Dropdown.Item>
                    <Dropdown.Item>This Month</Dropdown.Item>
                    <Dropdown.Item>This Year</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              
              <div className="sales-progress mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <h6>Monthly Target: ${salesData.target.toLocaleString()}</h6>
                  <h6>Current: ${salesData.current.toLocaleString()}</h6>
                </div>
                <ProgressBar 
                  now={salesData.percentage} 
                  label={`${salesData.percentage}%`} 
                  animated 
                  variant="gradient-primary"
                  className="mb-3" 
                />
                <div className="d-flex justify-content-between">
                  <Badge bg="light" text="success" className="py-2 px-3 rounded-pill">
                    <FontAwesomeIcon icon={faChartLine} className="me-1" />
                    {salesData.comparison}
                  </Badge>
                  <Button variant="outline-primary" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
              
              <Row className="g-3 mt-3">
                {salesData.metrics.map((metric, index) => (
                  <Col sm={6} key={`metric-${index}`}>
                    <div className="metric-card p-3 rounded">
                      <h6 className="text-muted mb-2">{metric.name}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">{metric.value}</h4>
                        <Badge bg={metric.change.startsWith('+') ? 'success-light' : 'danger-light'} text={metric.change.startsWith('+') ? 'success' : 'danger'}>
                          {metric.change}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Quick Access Section */}
          <Card className="mb-4 shadow-sm" data-aos="fade-up" data-aos-delay="100">
            <Card.Body>
              <Card.Title className="mb-4">
                <FontAwesomeIcon icon={faRocket} className="text-warning me-2" />
                Quick Actions
              </Card.Title>
              <Row className="g-3">
                {quickAccessCards.map((card, index) => (
                  <Col md={6} key={`quick-access-${index}`}>
                    <Card className="h-100 action-card">
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <div className="icon-wrapper me-3">
                            <FontAwesomeIcon icon={card.icon} size="lg" className="text-primary" />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <Card.Title className="mb-1">{card.title}</Card.Title>
                              {card.badge && (
                                <Badge bg={card.badge.variant} pill>{card.badge.text}</Badge>
                              )}
                            </div>
                            <Card.Text className="text-muted small mb-2">{card.description}</Card.Text>
                            <Button 
                              as={Link} 
                              to={card.link} 
                              variant="link" 
                              className="p-0 text-primary"
                            >
                              Go to {card.title}
                              <FontAwesomeIcon icon={faRocket} className="ms-2" />
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col lg={4}>
          {/* Notifications Section */}
          <Card className="mb-4 shadow-sm" data-aos="fade-up" data-aos-delay="150">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  <FontAwesomeIcon icon={faBell} className="text-danger me-2" />
                  Notifications
                </Card.Title>
                <Badge bg="danger" pill>{notifications.length}</Badge>
              </div>
              
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div 
                    key={`notification-${notification.id}`}
                    className={`notification-item ${notification.urgent ? 'urgent' : ''}`}
                  >
                    <div className="notification-icon">
                      <FontAwesomeIcon 
                        icon={notification.category === 'orders' ? faShoppingBag : 
                              notification.category === 'inventory' ? faBoxOpen : 
                              notification.category === 'support' ? faHeadset : 
                              notification.category === 'feedback' ? faUsers : faCog} 
                        className={notification.urgent ? 'text-danger' : 'text-muted'}
                      />
                    </div>
                    <div className="notification-content">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">{notification.text}</h6>
                        {notification.urgent && (
                          <span className="badge bg-danger">Urgent</span>
                        )}
                      </div>
                      <small className="text-muted">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                        {notification.time}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline-secondary" className="w-100 mt-3">
                View All Notifications
              </Button>
            </Card.Body>
          </Card>

          {/* Recent Activity Section */}
          <Card className="mb-4 shadow-sm" data-aos="fade-up" data-aos-delay="200">
            <Card.Body>
              <Card.Title className="mb-4">
                <FontAwesomeIcon icon={faLightbulb} className="text-info me-2" />
                Recent Activity
              </Card.Title>
              
              <div className="activity-timeline">
                {recentActivities.map((activity) => (
                  <div key={`activity-${activity.id}`} className="activity-item">
                    <div className="activity-icon">
                      <FontAwesomeIcon icon={activity.icon} className="text-white" />
                    </div>
                    <div className="activity-content">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">{activity.action}</h6>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                      <small className="text-muted">
                        <FontAwesomeIcon icon={faUserCircle} className="me-1" />
                        {activity.user}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Performance Metrics */}
          <Card className="shadow-sm" data-aos="fade-up" data-aos-delay="250">
            <Card.Body>
              <Card.Title className="mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-success me-2" />
                Key Metrics
              </Card.Title>
              
              <div className="metrics-grid">
                {performanceMetrics.map((metric, index) => (
                  <div key={`performance-${index}`} className="metric-item">
                    <h6 className="text-muted mb-2">{metric.name}</h6>
                    <div className="d-flex align-items-end">
                      <h4 className="mb-0 me-2">{metric.value}</h4>
                      <small className={`mb-1 ${metric.positive ? 'text-success' : 'text-danger'}`}>
                        {metric.change}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Support Section */}
      <Row className="mt-5">
        <Col>
          <Card className="support-card shadow-lg" data-aos="zoom-in">
            <Card.Body className="text-center p-5">
              <div className="support-icon mb-4">
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <h3 className="mb-3">Need Help With Your Store?</h3>
              <p className="text-muted mb-4">
                Our dedicated support team is available 24/7 to assist you with any questions or issues you may have.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="primary" size="lg">
                  <FontAwesomeIcon icon={faHeadset} className="me-2" />
                  Live Chat
                </Button>
                <Button variant="outline-secondary" size="lg">
                  <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                  Knowledge Base
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OwnerHomePage;