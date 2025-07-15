import { SortControl } from '../SortControl';
import { VizPreviewCollection } from '../VizPreviewCollection';
import { More } from '../More';
import { Footer } from '../Footer';
import { CreateNewButton } from '../CreateNewButton';
import { useState, useEffect } from 'react';
import './styles.scss';

export const SearchPageBody = ({
  // Viz preview list props.
  renderVizPreviews,
  onMoreClick,
  isLoadingNextPage,

  // Sort control props.
  sortId,
  setSortId,
  sortOptions,
  hasMore,
  
  // Search props
  initialSearchTerm = '',
  onSearch = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(0);
  
  // Filter options
  const filterOptions = [
    { id: 'charts', label: 'Charts' },
    { id: 'maps', label: 'Maps' },
    { id: 'dashboards', label: 'Dashboards' },
    { id: 'd3', label: 'D3.js' },
    { id: 'react', label: 'React' },
    { id: 'threejs', label: 'Three.js' }
  ];
  
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    // Simulate search results count
    setSearchResults(Math.floor(Math.random() * 50) + 10);
  };
  
  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };
  
  useEffect(() => {
    // Simulate initial search results
    setSearchResults(23);
  }, []);
  return (
    <div className="vh-page vh-search-page">
      <div className="vh-page-container">
        <div className="vh-page-header">
          <div className="search-hero">
            <h2>Discover Powerful Visualizations</h2>
            <p className="search-subtitle">Explore, learn from, and fork thousands of interactive data visualizations created by the community</p>
            
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keyword, technique, or data type..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
            
            <div className="search-quick-filters">
              <span className="quick-filter-label">Popular searches:</span>
              <button className="quick-filter-tag" onClick={() => {setSearchTerm('d3.js'); onSearch('d3.js');}}>D3.js</button>
              <button className="quick-filter-tag" onClick={() => {setSearchTerm('maps'); onSearch('maps');}}>Maps</button>
              <button className="quick-filter-tag" onClick={() => {setSearchTerm('dashboard'); onSearch('dashboard');}}>Dashboards</button>
              <button className="quick-filter-tag" onClick={() => {setSearchTerm('react'); onSearch('react');}}>React</button>
              <button className="quick-filter-tag" onClick={() => {setSearchTerm('threejs'); onSearch('threejs');}}>Three.js</button>
              <button className="quick-filter-tag" onClick={() => {setSearchTerm('data science'); onSearch('data science');}}>Data Science</button>
            </div>
          </div>
          
          <div className="search-results-header">
            {searchResults > 0 && (
              <div className="search-results-info">
                <span className="results-count">{searchResults}</span> visualizations found
                {searchTerm && <span className="search-term-display"> for "<strong>{searchTerm}</strong>"</span>}
              </div>
            )}
            
            <div className="search-controls">
              <div className="filter-section">
                <button 
                  className={`filter-toggle ${isFilterOpen ? 'active' : ''}`} 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filters {selectedFilters.length > 0 && <span className="filter-badge">{selectedFilters.length}</span>}
                </button>
                
                {isFilterOpen && (
                  <div className="filter-options">
                    <div className="filter-options-header">
                      <h4>Filter Visualizations</h4>
                      {selectedFilters.length > 0 && (
                        <button 
                          className="clear-filters" 
                          onClick={() => setSelectedFilters([])}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="filter-options-body">
                      {filterOptions.map(filter => (
                        <label key={filter.id} className="filter-option">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter.id)}
                            onChange={() => toggleFilter(filter.id)}
                          />
                          <span>{filter.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {sortOptions ? (
                <SortControl
                  sortId={sortId}
                  setSortId={setSortId}
                  sortOptions={sortOptions}
                />
              ) : null}
              
              <CreateNewButton />
            </div>
          </div>
          
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=CW7ICKQM&placement=vizhubcom&format=cover" id="_carbonads_js"></script>',
            }}
          />
        </div>
        <VizPreviewCollection>
          {renderVizPreviews()}
        </VizPreviewCollection>
        <More
          hasMore={hasMore}
          onMoreClick={onMoreClick}
          isLoadingNextPage={isLoadingNextPage}
        />
      </div>
      <Footer />
    </div>
  );
};
