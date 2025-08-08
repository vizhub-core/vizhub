import { Header } from '../components/Header';
import { HeaderTop } from '../components/HeaderTop';
import { SearchPageBody } from '../components/SearchPageBody';

const Story = () => {
  // Mock data for the SearchPageBody component
  const mockVizPreviews = () => (
    <>
      <div className="viz-preview">
        <div className="viz-preview-header">
          <h3>D3 Bar Chart</h3>
          <div className="viz-tags">
            <span className="viz-tag">D3.js</span>
            <span className="viz-tag">Chart</span>
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
            <button className="preview-button">View Visualization</button>
          </div>
          Bar Chart Preview
        </div>
        <div className="preview-meta">
          <span className="author">
            <img src="https://via.placeholder.com/24" alt="User avatar" className="author-avatar" />
            User123
          </span>
          <div className="preview-stats">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> 12</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 28</span>
          </div>
        </div>
      </div>
      <div className="viz-preview">
        <div className="viz-preview-header">
          <h3>Interactive Map Visualization</h3>
          <div className="viz-tags">
            <span className="viz-tag">Maps</span>
            <span className="viz-tag">GeoJSON</span>
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
            <button className="preview-button">View Visualization</button>
          </div>
          Map Visualization Preview
        </div>
        <div className="preview-meta">
          <span className="author">
            <img src="https://via.placeholder.com/24" alt="User avatar" className="author-avatar" />
            DataVizPro
          </span>
          <div className="preview-stats">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> 8</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 15</span>
          </div>
        </div>
      </div>
      <div className="viz-preview">
        <div className="viz-preview-header">
          <h3>COVID-19 Dashboard</h3>
          <div className="viz-tags">
            <span className="viz-tag">Dashboard</span>
            <span className="viz-tag">React</span>
          </div>
        </div>
        <div className="preview-image" style={{ 
          height: '250px', 
          background: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#555',
          fontWeight: 500,
          position: 'relative',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E"), linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)`
        }}>
          <div className="preview-overlay">
            <button className="preview-button">View Visualization</button>
          </div>
          Dashboard Preview
        </div>
        <div className="preview-meta">
          <span className="author">
            <img src="https://via.placeholder.com/24" alt="User avatar" className="author-avatar" />
            HealthStats
          </span>
          <div className="preview-stats">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> 24</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 42</span>
          </div>
        </div>
      </div>
    </>
  );

  const mockSortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'forked', label: 'Most Forked' }
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
          sortId="recent"
          setSortId={(id) => console.log('Sort changed to:', id)}
          sortOptions={mockSortOptions}
          hasMore={true}
          initialSearchTerm="d3"
          onSearch={(term) => console.log('Searching for:', term)}
        />
      </div>
    </div>
  );
};

export default Story;
