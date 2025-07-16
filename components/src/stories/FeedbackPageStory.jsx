import { useState } from 'react';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would send the feedback to a server
    console.log('Feedback submitted:', { feedback, email });
    setSubmitted(true);
    setFeedback('');
    setEmail('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Feedback</h1>
          <p className="lead mb-4">
            We value your feedback! Please let us know how we can improve VizHub.
          </p>
          
          {submitted ? (
            <div className="alert alert-success" role="alert">
              Thank you for your feedback! We appreciate your input.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="feedbackText" className="form-label">Your Feedback</label>
                <textarea 
                  className="form-control" 
                  id="feedbackText" 
                  rows="6"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  placeholder="Tell us what you think about VizHub, suggest features, or report issues..."
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email (optional)</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="If you'd like us to follow up with you"
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Feedback</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Story = () => {
  return <FeedbackPage />;
};

export default Story;
