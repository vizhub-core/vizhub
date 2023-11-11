import React from 'react';

const About = () => (
  <div className="about">
    <div className="about__content">
      <div className="about__title"> </div>
      <div className="about__subtitle">
        <p>
          Embark on Your Visualization Journey with VizHub!
        </p>
      </div>
      <div className="about__desc">
        <p>
          VizHub is a platform designed for data
          visualization and data science. It provides an
          environment where users can create, share, and
          explore data visualizations using web technologies
          like HTML, CSS, and JavaScript. Here are some key
          aspects of VizHub: Interactive Visualizations:
          VizHub focuses on interactive visualizations,
          which are often created using D3.js, a popular
          JavaScript library for data visualization. Users
          can manipulate data in real-time to gain deeper
          insights. Community and Collaboration: The
          platform encourages collaboration and sharing
          among users. Creators can share their
          visualizations, and others can fork (copy and
          modify) these projects, promoting a
          community-driven approach to learning and
          exploration. Educational Resource: VizHub is often
          used as an educational tool. It provides a
          hands-on way for students and learners to
          understand data visualization concepts. The
          platform is also useful for teaching web
          development skills as it involves using HTML, CSS,
          and JavaScript. Open Source: Many of the projects
          and visualizations on VizHub are open source,
          allowing users to see the code behind the
          visualizations. This openness fosters learning and
          allows users to build upon existing work.
          Real-Time Code Editing: VizHub offers a real-time
          code editing experience. As users modify the code,
          they can see the changes in their visualizations
          instantly, making it an effective tool for rapid
          prototyping and experimentation. Data-Driven
          Documents: The platform often uses D3.js
          (Data-Driven Documents), which is a powerful tool
          for creating complex, data-driven visualizations.
          This enables users to represent large datasets in
          an interactive and visually appealing way.
          Accessibility and Ease of Use: VizHub is designed
          to be accessible to both beginners and experienced
          developers. It provides a user-friendly interface
          that simplifies the process of creating and
          sharing data visualizations. Integration with
          Other Tools: VizHub can integrate with other data
          science and development tools, making it a
          versatile platform for a wide range of projects.
          VizHub is particularly popular among data
          scientists, researchers, students, and educators
          who are interested in visualizing data in an
          interactive and collaborative environment.
        </p>
      </div>
    </div>
  </div>
);

export const AboutPageBody = () => (
  <div className="vh-page vh-landing-page-body">
    <About />
  </div>
);
//how to solve untracked files
//git add .
