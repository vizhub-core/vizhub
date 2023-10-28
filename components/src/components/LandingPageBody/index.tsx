// import React from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
// } from '../bootstrap';

// export const LandingPageBody = () => {
//   return (
//     <Container fluid className="p-5 bg-light">
//       <Container className="my-5">
//         <Row className="align-items-center">
//           <Col md={8}>
//             <h1>
//               Welcome to Our Data Visualization Platform!
//             </h1>
//             <p>
//               Revolutionizing the way you collaborate and
//               design data visualizations.
//             </p>
//             <Button variant="primary" href="#features">
//               Learn More
//             </Button>
//           </Col>
//         </Row>
//       </Container>

//       <section id="features">
//         <Container>
//           <h2 className="mb-4">Key Features</h2>
//           <Row className="mb-3">
//             <Col>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>
//                     Browser-based Designing
//                   </Card.Title>
//                   <Card.Text>
//                     Enable designers to contribute to data
//                     visualization projects using just a
//                     browser, no local setup required.
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>
//                     Real-time Mob Programming
//                   </Card.Title>
//                   <Card.Text>
//                     Collaborate seamlessly in real-time and
//                     enhance team synergy.
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>
//                     AI-Assisted Coding
//                   </Card.Title>
//                   <Card.Text>
//                     Bring in an AI collaborator directly
//                     into your editor during mob programming
//                     sessions.
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>
//                     Freedom with Vanilla JavaScript
//                   </Card.Title>
//                   <Card.Text>
//                     Author in Vanilla JavaScript and easily
//                     export your work without any platform
//                     lock-in.
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="mb-3">
//             <Col>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>
//                     Streamlined Development
//                   </Card.Title>
//                   <Card.Text>
//                     Boost your team's efficiency in data
//                     visualization development.
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>
//                     Immediate Client Feedback
//                   </Card.Title>
//                   <Card.Text>
//                     Action feedback instantly with real-time
//                     collaboration and hot reloading.
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </Container>
//   );
// };

import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
} from '../bootstrap';

import { featureData } from './featureData';
import './styles.scss';

// Example feature
// {
//   sectionHeader: 'Captivating Introduction',
//   title: 'Unleash Visualization Magic',
//   description:
//     'Discover VizHub, the ultimate platform for creating, sharing, and exploring dynamic data visualizations.',
//   cta: 'Explore Now',
//   imageDescription:
//     'A mesmerizing animated visualization, perhaps a swirling interactive globe or particle flow.',
// },

const Content = ({ feature }) => {
  return (
    <div className="feature__group">
      <div className="feature__top">
        <div className="feature__header">
          {feature.sectionHeader}
        </div>
        <div className="feature__title">
          {feature.title}
        </div>
      </div>
      <div className="feature__description">
        {feature.description}
      </div>
      <Button>{feature.cta}</Button>
    </div>
  );
};

const ImageSection = ({ feature }) => {
  return (
    <div className="feature__image">
      {feature.imageDescription}
    </div>
  );
};

// Put the image
// Who can use it
// Title on features section

const HeroSection = () => {
  return (
    <div className="vh-landing-page-hero">
      <div className="vh-landing-page-hero__content">
        <div className="vh-landing-page-hero__title">
          Unleash Visualization Magic
        </div>
        <div className="vh-landing-page-hero__description">
          Discover VizHub, the ultimate platform for
          creating, sharing, and exploring dynamic data
          visualizations.
        </div>
        <Button>Explore Now</Button>
      </div>
      <div className="vh-landing-page-hero__image"></div>
    </div>
  );
};
export const LandingPageBody = () => {
  return (
    <div className="vh-page vh-landing-page-body">
      <HeroSection />
      {featureData.map((feature, index) => (
        <div className="feature">
          {index % 2 === 0 ? (
            <>
              <Content feature={feature} />
              <ImageSection feature={feature} />
            </>
          ) : (
            <>
              <ImageSection feature={feature} />
              <Content feature={feature} />
            </>
          )}
        </div>
      ))}

      {/* <h1>
              Welcome to Our Data Visualization Platform!
            </h1>
            <p>
              Revolutionizing the way you collaborate and
              design data visualizations.
            </p>
            <Button variant="primary" href="#features">
              Learn More
            </Button>
      <div class="features">
        <Container>
          <h2 className="mb-4">Key Features</h2>
          {featureData
            .map((feature, index) => (
              <Row key={index} className="mb-3">
                <Col>
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title>
                        {feature.title}
                      </Card.Title>
                      <Card.Text>
                        {feature.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                {featureData[index + 1] && (
                  <Col>
                    <Card className="mb-3">
                      <Card.Body>
                        <Card.Title>
                          {featureData[index + 1].title}
                        </Card.Title>
                        <Card.Text>
                          {
                            featureData[index + 1]
                              .description
                          }
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            )
        </Container>
      </section> */}
    </div>
  );
};
