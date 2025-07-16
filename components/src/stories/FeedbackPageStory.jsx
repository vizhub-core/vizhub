import { useState, useEffect, useRef } from 'react';

// Custom hook for form validation with improved error handling
const useFormValidation = (initialState, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting]);

  useEffect(() => {
    const validationErrors = validate(values);
    const touchedErrors = Object.keys(validationErrors)
      .filter(key => touched[key])
      .reduce((acc, key) => {
        if (validationErrors[key]) acc[key] = validationErrors[key];
        return acc;
      }, {});
    
    setErrors(touchedErrors);
  }, [values, touched, validate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    resetForm,
    setValues
  };
};

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [showRatingError, setShowRatingError] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  
  // For accessibility - scroll to top of form when step changes
  const formTopRef = useRef(null);

  // Form validation function
  const validateForm = (values) => {
    let errors = {};
    
    // Validate feedback
    if (!values.feedback) {
      errors.feedback = 'Feedback is required';
    } else if (values.feedback.length < 10) {
      errors.feedback = 'Feedback must be at least 10 characters';
    }
    
    // Validate email format if provided
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    
    return errors;
  };

  // Initialize form with validation
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm,
    setValues
  } = useFormValidation(
    { name: '', email: '', feedback: '', organization: '' },
    validateForm
  );

  // Effect to scroll to top when step changes
  useEffect(() => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [formStep]);

  // Handle file uploads with validation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check if adding these files would exceed the 5 file limit
      if (attachments.length + files.length > 5) {
        setFormError('You can only upload a maximum of 5 files');
        return;
      }
      
      // Check file sizes
      const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setFormError(`Some files exceed the 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
      
      setFormError('');
      const newAttachments = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
    
    // Reset the file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    if (newAttachments[index].preview) {
      URL.revokeObjectURL(newAttachments[index].preview);
    }
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const validateBeforeSubmit = () => {
    // Check if rating is required but not provided
    if (feedbackType !== 'bug' && rating === 0) {
      setShowRatingError(true);
      return false;
    }
    
    // Check if feedback is provided
    if (!values.feedback || values.feedback.trim().length < 10) {
      setFormError('Please provide detailed feedback (at least 10 characters)');
      return false;
    }
    
    // Check email format if provided
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    setFormError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateBeforeSubmit()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real implementation, this would send the feedback to a server
        console.log('Feedback submitted:', { 
          ...values,
          feedbackType,
          rating,
          attachments: attachments.map(a => a.name)
        });
        setSubmitted(true);
        setIsSubmitting(false);
        resetForm();
        setRating(0);
        setAttachments([]);
        setFeedbackType('general');
      } catch (error) {
        console.error('Error submitting feedback:', error);
        setFormError('There was an error submitting your feedback. Please try again.');
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const handleReset = () => {
    setSubmitted(false);
    resetForm();
    setFeedbackType('general');
    setRating(0);
    setAttachments([]);
    setFormStep(1);
    setShowPreview(false);
  };

  const renderStarRating = () => {
    const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    
    return (
      <div className="star-rating mb-4">
        <fieldset>
          <legend className="form-label fw-bold">How would you rate your experience?</legend>
          <div className="d-flex align-items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                onClick={() => {
                  setRating(star);
                  setShowRatingError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setRating(star);
                    setShowRatingError(false);
                  }
                }}
                role="button"
                tabIndex={0}
                className="me-1"
                style={{ 
                  cursor: 'pointer', 
                  fontSize: '2.5rem',
                  color: star <= rating ? '#ffc107' : '#e4e5e9',
                  transition: 'color 0.2s ease'
                }}
                aria-label={`${star} star${star !== 1 ? 's' : ''} (${ratingLabels[star-1]})`}
              >
                ★
              </span>
            ))}
            <span className="ms-3 text-muted" aria-live="polite">
              {rating > 0 ? ratingLabels[rating-1] : ''}
            </span>
          </div>
          {showRatingError && rating === 0 && (
            <div className="text-danger mt-1" role="alert">Please provide a rating</div>
          )}
        </fieldset>
      </div>
    );
  };

  const renderFeedbackTypeSelector = () => {
    const types = [
      { id: 'general', label: 'General Feedback', icon: '💬', description: 'Share your thoughts about VizHub' },
      { id: 'bug', label: 'Report a Bug', icon: '🐞', description: 'Tell us about something that isn\'t working' },
      { id: 'feature', label: 'Feature Request', icon: '✨', description: 'Suggest a new feature or improvement' },
      { id: 'usability', label: 'Usability Issue', icon: '🖱️', description: 'Report difficulties using the interface' }
    ];
    
    return (
      <div className="mb-4">
        <fieldset>
          <legend className="form-label fw-bold">Feedback Type</legend>
          <div className="d-flex flex-wrap gap-2">
            {types.map(type => (
              <div 
                key={type.id}
                className={`btn ${feedbackType === type.id ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center`}
                onClick={() => setFeedbackType(type.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setFeedbackType(type.id);
                  }
                }}
                role="radio"
                aria-checked={feedbackType === type.id}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                title={type.description}
              >
                <span className="me-2" aria-hidden="true">{type.icon}</span>
                {type.label}
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  };

  const renderAttachments = () => {
    if (attachments.length === 0) return null;
    
    return (
      <div className="mb-4">
        <label className="form-label fw-bold">Attachments</label>
        <div className="d-flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="card p-2" style={{ maxWidth: '200px' }}>
              {file.preview ? (
                <img 
                  src={file.preview} 
                  alt={file.name} 
                  className="img-fluid mb-2" 
                  style={{ maxHeight: '100px', objectFit: 'contain' }}
                />
              ) : (
                <div className="text-center p-3 bg-light mb-2">
                  <i className="bi bi-file-earmark fs-1"></i>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-truncate" style={{ maxWidth: '130px' }}>{file.name}</small>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={() => removeAttachment(index)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFormStep1 = () => (
    <>
      {renderFeedbackTypeSelector()}
      
      {feedbackType !== 'bug' && renderStarRating()}
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="nameInput" className="form-label fw-bold">Your Name (optional)</label>
          <input 
            type="text" 
            className="form-control" 
            id="nameInput"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="How should we address you?"
          />
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="organizationInput" className="form-label fw-bold">Organization (optional)</label>
          <input 
            type="text" 
            className="form-control" 
            id="organizationInput"
            name="organization"
            value={values.organization}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Company or institution"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="emailInput" className="form-label fw-bold">Email (optional)</label>
        <input 
          type="email" 
          className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
          id="emailInput"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="If you'd like us to follow up with you"
        />
        {errors.email && touched.email && (
          <div className="invalid-feedback">{errors.email}</div>
        )}
        <div className="form-text">We'll never share your email with anyone else.</div>
      </div>
      
      <div className="d-flex justify-content-end">
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setFormStep(2)}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </>
  );

  const renderFormStep2 = () => (
    <>
      <div className="mb-4">
        <label htmlFor="feedbackText" className="form-label fw-bold">
          {feedbackType === 'bug' ? 'Describe the Bug' : 
           feedbackType === 'feature' ? 'Describe the Feature' : 
           'Your Feedback'}
        </label>
        <textarea 
          className={`form-control ${errors.feedback && touched.feedback ? 'is-invalid' : ''}`}
          id="feedbackText"
          name="feedback" 
          rows="6"
          value={values.feedback}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          placeholder={
            feedbackType === 'bug' ? "Please describe what happened, steps to reproduce, and what you expected..." :
            feedbackType === 'feature' ? "Tell us about the feature you'd like to see in VizHub..." :
            "Tell us what you think about VizHub, suggest improvements, or share your experience..."
          }
        ></textarea>
        {errors.feedback && touched.feedback && (
          <div className="invalid-feedback">{errors.feedback}</div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="form-label fw-bold">Add Screenshots or Files (optional)</label>
        <div className="input-group mb-3">
          <input 
            type="file" 
            className="form-control" 
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            aria-describedby="fileHelp"
          />
          <label className="input-group-text" htmlFor="fileInput">Upload</label>
        </div>
        <div className="form-text" id="fileHelp">
          <ul className="mb-0 ps-3">
            <li>Maximum 5 files</li>
            <li>Maximum 5MB per file</li>
            <li>Supported formats: Images, PDF, DOC, TXT</li>
          </ul>
        </div>
      </div>
      
      {renderAttachments()}
      
      <div className="d-flex justify-content-between">
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => setFormStep(1)}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        
        <div>
          <button 
            type="button" 
            className="btn btn-outline-primary me-2"
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </>
  );

  const renderPreview = () => (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-labelledby="previewModalTitle" aria-modal="true">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="previewModalTitle">Preview Your Feedback</h5>
            <button type="button" className="btn-close" onClick={() => setShowPreview(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <strong>Feedback Type:</strong> 
              <span className="badge bg-primary ms-2">
                {feedbackType === 'general' ? 'General Feedback' : 
                 feedbackType === 'bug' ? 'Bug Report' : 
                 feedbackType === 'feature' ? 'Feature Request' : 
                 'Usability Issue'}
              </span>
            </div>
            
            {feedbackType !== 'bug' && rating > 0 && (
              <div className="mb-3">
                <strong>Rating:</strong> 
                <span className="ms-2">
                  {Array(rating).fill('★').join('')} 
                  <span className="text-muted ms-1">
                    ({['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating-1]})
                  </span>
                </span>
              </div>
            )}
            
            {values.name && (
              <div className="mb-3">
                <strong>Name:</strong> <span className="ms-2">{values.name}</span>
              </div>
            )}
            
            {values.organization && (
              <div className="mb-3">
                <strong>Organization:</strong> <span className="ms-2">{values.organization}</span>
              </div>
            )}
            
            {values.email && (
              <div className="mb-3">
                <strong>Email:</strong> <span className="ms-2">{values.email}</span>
              </div>
            )}
            
            <div className="mb-3">
              <strong>Feedback:</strong>
              <div className="card p-3 mt-2 bg-light">
                {values.feedback.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">{line || <br />}</p>
                ))}
              </div>
            </div>
            
            {attachments.length > 0 && (
              <div className="mb-3">
                <strong>Attachments:</strong>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="card p-2" style={{ maxWidth: '150px' }}>
                      {file.preview ? (
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="img-fluid mb-2" 
                          style={{ maxHeight: '80px', objectFit: 'contain' }}
                        />
                      ) : (
                        <div className="text-center p-2 bg-light mb-2">
                          <i className="bi bi-file-earmark fs-3"></i>
                        </div>
                      )}
                      <small className="text-truncate">{file.name}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                setShowPreview(false);
                handleSubmit({ preventDefault: () => {} });
              }}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow" ref={formTopRef}>
            <div className="card-header bg-primary text-white py-3">
              <h1 className="card-title text-center mb-0 fs-3">Share Your Feedback</h1>
            </div>
            <div className="card-body p-4 p-md-5">
              {formError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {formError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setFormError('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              {submitted ? (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <div className="display-1 text-success">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  </div>
                  <h2 className="mb-3">Thank You!</h2>
                  <p className="lead mb-4">
                    Your feedback has been submitted successfully. We appreciate your input and will use it to improve VizHub.
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleReset}
                    >
                      Submit Another Response
                    </button>
                    <a 
                      href="/"
                      className="btn btn-primary"
                    >
                      Return to Home
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <p className="lead mb-4 text-center">
                    We value your feedback! Please let us know how we can improve VizHub.
                  </p>
                  
                  <div className="progress mb-4" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: formStep === 1 ? '50%' : '100%' }}
                      aria-valuenow={formStep === 1 ? 50 : 100} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  
                  <div className="mb-3 text-center">
                    <span className="badge bg-primary p-2">Step {formStep} of 2</span>
                  </div>
                  
                  <form onSubmit={handleSubmit} ref={formRef} noValidate>
                    {formStep === 1 ? renderFormStep1() : renderFormStep2()}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showPreview && renderPreview()}
    </div>
  );
};

const Story = () => {
  return <FeedbackPage />;
};

export default Story;
