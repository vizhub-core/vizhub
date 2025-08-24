import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { SearchPageBody } from '../components/SearchPageBody';

const Story = () => {
  // Mock data for the SearchPageBody component
  const mockVizPreviews = () => (
    <>
      <div className="viz-preview">
        <div className="viz-preview-header">
          <h3>Documentation Resources</h3>
          <div className="viz-tags">
            <span className="viz-tag">Docs</span>
            <span className="viz-tag">Tutorial</span>
          </div>
        </div>
        <div className="preview-image" style={{ 
          height: '250px', 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#555',
          fontWeight: 500,
          position: 'relative',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`
        }}>
          <div className="preview-overlay">
            <button className="preview-button">View Resource</button>
          </div>
          Documentation Resources
        </div>
        <div className="preview-meta">
          <span className="author">
            <img src="https://via.placeholder.com/24" alt="User avatar" className="author-avatar" />
            VizHub Team
          </span>
          <div className="preview-stats">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> 45</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 78</span>
          </div>
        </div>
      </div>
      <div className="viz-preview">
        <div className="viz-preview-header">
          <h3>Learning Resources</h3>
          <div className="viz-tags">
            <span className="viz-tag">Tutorials</span>
            <span className="viz-tag">Learning</span>
          </div>
        </div>
        <div className="preview-image" style={{ 
          height: '250px', 
          background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#555',
          fontWeight: 500,
          position: 'relative',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"), linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)`
        }}>
          <div className="preview-overlay">
            <button className="preview-button">View Resource</button>
          </div>
          Learning Resources
        </div>
        <div className="preview-meta">
          <span className="author">
            <img src="https://via.placeholder.com/24" alt="User avatar" className="author-avatar" />
            VizHub Team
          </span>
          <div className="preview-stats">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> 32</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 56</span>
          </div>
        </div>
      </div>
    </>
  );

  const mockSortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'relevance', label: 'Most Relevant' }
  ];

  return (
    <div className="layout-fullscreen">
      <div className="vh-page">
        <HeaderTop />
        <Header
          authenticatedUserAvatarURL=""
          loginHref="/login"
          logoutHref="/logout"
          profileHref="/profile"
          createVizHref="/create"
          onVizHubClick={() => {}}
          pricingHref="/pricing"
          onNotificationsClick={() => {}}
          onBillingClick={() => {}}
          userHasNotifications={false}
        />
        <SearchPageBody
          renderVizPreviews={mockVizPreviews}
          onMoreClick={() => console.log('Load more clicked')}
          isLoadingNextPage={false}
          sortId="relevance"
          setSortId={(id) => console.log('Sort changed to:', id)}
          sortOptions={mockSortOptions}
          hasMore={true}
          initialSearchTerm="resources"
          onSearch={(term) => console.log('Searching for:', term)}
        />
      </div>
    </div>
  );
};

export default Story;
