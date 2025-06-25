// @ts-nocheck
import Fuse from 'fuse.js';

interface CollectionItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  topics?: string[];
  location?: string;
  roles?: string[];
  [key: string]: any;
}

interface Filters {
  search: string;
  topics?: string[];
  location?: string;
  roles?: string[];
  sort: string;
  view: string;
}

class CollectionFilter {
  private container: HTMLElement;
  private collection: string;
  private items: CollectionItem[];
  private currentFilters: Filters;
  private availableFilters: any;
  private sortOptions: Array<{ value: string; label: string }>;
  private fuse: Fuse<CollectionItem>;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    const container = document.getElementById('collection-container');
    if (!container) return;

    this.container = container;
    this.collection = container.dataset.collection || 'events';
    this.items = JSON.parse(container.dataset.items || '[]');
    this.availableFilters = JSON.parse(container.dataset.availableFilters || '{}');
    this.sortOptions = JSON.parse(container.dataset.sortOptions || '[]');
    
    // Parse URL parameters directly
    const urlParams = new URLSearchParams(window.location.search);
    this.currentFilters = {
      search: urlParams.get('search') || '',
      topics: urlParams.get('topics')?.split(',').filter(Boolean) || [],
      location: urlParams.get('location') || '',
      roles: urlParams.get('roles')?.split(',').filter(Boolean) || [],
      sort: urlParams.get('sort') || (this.collection === 'events' ? 'date-desc' : 'name-asc'),
      view: '' // View is determined by the route, not URL params
    };

    // Initialize Fuse.js for fuzzy search
    this.fuse = new Fuse(this.items, {
      keys: ['title', 'description', 'topics', 'location'],
      threshold: 0.3,
      includeScore: true
    });

    this.initializeEventListeners();
    this.syncUIWithFilters();
    this.updateActiveFiltersDisplay();
    // Don't apply initial filtering - already done by inline script
  }

  private syncUIWithFilters() {
    // Sync search input
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput && this.currentFilters.search) {
      searchInput.value = this.currentFilters.search;
    }

    // Sync filter checkboxes and radios
    document.querySelectorAll('[data-filter]').forEach((input) => {
      const element = input as HTMLInputElement;
      const filterType = element.dataset.filter!;

      if (element.type === 'checkbox') {
        const isMultiple = element.dataset.multiple === 'true';
        if (isMultiple && Array.isArray(this.currentFilters[filterType])) {
          element.checked = (this.currentFilters[filterType] as string[]).includes(element.value);
        } else if (!isMultiple) {
          element.checked = this.currentFilters[filterType] === element.value;
        }
      } else if (element.type === 'radio') {
        element.checked = this.currentFilters[filterType] === element.value;
      }
    });
  }

  private initializeEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.debounce(() => {
          this.currentFilters.search = (e.target as HTMLInputElement).value;
          this.applyFilters();
        }, 300);
      });
    }

    // Clear search button
    const clearSearch = document.getElementById('clear-search');
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        this.currentFilters.search = '';
        if (searchInput) searchInput.value = '';
        this.applyFilters();
      });
    }

    // Filter dropdowns
    document.querySelectorAll('[data-filter]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const filterType = target.dataset.filter!;
        const isMultiple = target.dataset.multiple === 'true';

        if (target.type === 'radio') {
          // Radio buttons (like sort) - always set the value
          this.currentFilters[filterType] = target.value;
        } else if (isMultiple) {
          // Multi-select checkboxes
          if (!this.currentFilters[filterType]) {
            this.currentFilters[filterType] = [];
          }
          const values = this.currentFilters[filterType] as string[];
          if (target.checked) {
            if (!values.includes(target.value)) {
              values.push(target.value);
            }
          } else {
            const index = values.indexOf(target.value);
            if (index > -1) {
              values.splice(index, 1);
            }
          }
        } else {
          // Single-select checkboxes
          this.currentFilters[filterType] = target.checked ? target.value : '';
        }

        this.applyFilters();
      });
    });

    // Clear filter buttons
    document.querySelectorAll('[data-clear-filter]').forEach((button) => {
      button.addEventListener('click', (e) => {
        const filterType = (e.currentTarget as HTMLElement).dataset.clearFilter!;
        if (Array.isArray(this.currentFilters[filterType])) {
          this.currentFilters[filterType] = [];
        } else {
          this.currentFilters[filterType] = '';
        }
        this.applyFilters();
      });
    });

    // View mode is now handled by static routes, no client-side logic needed

    // Clear all filters button
    const clearAllButton = document.getElementById('clear-all-filters');
    if (clearAllButton) {
      clearAllButton.addEventListener('click', () => {
        // Reset all filters
        this.currentFilters.search = '';
        this.currentFilters.topics = [];
        this.currentFilters.location = '';
        this.currentFilters.roles = [];
        this.currentFilters.sort = this.collection === 'events' ? 'date-desc' : 'name-asc';
        
        // Reset UI elements
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) searchInput.value = '';
        
        // Uncheck all checkboxes and radios
        document.querySelectorAll('[data-filter]').forEach((input) => {
          const element = input as HTMLInputElement;
          if (element.type === 'checkbox') {
            element.checked = false;
          } else if (element.type === 'radio' && element.value === this.currentFilters.sort) {
            element.checked = true;
          }
        });
        
        this.applyFilters();
      });
    }

    // Browser back/forward navigation
    window.addEventListener('popstate', (e) => {
      if (e.state) {
        this.currentFilters = e.state;
        this.renderFilteredItems();
        this.updateActiveFiltersDisplay();
      }
    });
  }

  private debounce(func: Function, wait: number) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => func(), wait);
  }

  private applyFilters() {
    this.renderFilteredItems();
    this.updateURL();
    this.updateActiveFiltersDisplay();
  }

  private getFilteredItems(): CollectionItem[] {
    let filtered = [...this.items];

    // Apply search filter using Fuse.js
    if (this.currentFilters.search) {
      const results = this.fuse.search(this.currentFilters.search);
      filtered = results.map(result => result.item);
    }

    // Apply topic filters
    if (this.currentFilters.topics?.length) {
      filtered = filtered.filter(item => 
        item.topics?.some(topic => this.currentFilters.topics!.includes(topic))
      );
    }

    // Apply location filter
    if (this.currentFilters.location) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase() === this.currentFilters.location.toLowerCase()
      );
    }

    // Apply role filters (for people)
    if (this.currentFilters.roles?.length) {
      filtered = filtered.filter(item => 
        item.roles?.some(role => this.currentFilters.roles!.includes(role))
      );
    }

    // Apply sorting
    return this.sortItems(filtered);
  }

  private sortItems(items: CollectionItem[]): CollectionItem[] {
    const sorted = [...items];
    
    console.log('Sorting with:', this.currentFilters.sort, 'Items count:', sorted.length);
    
    switch (this.currentFilters.sort) {
      case 'date-asc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.date!).getTime();
          const dateB = new Date(b.date!).getTime();
          console.log('Comparing dates:', a.date, dateA, 'vs', b.date, dateB);
          return dateA - dateB;
        });
      case 'date-desc':
        return sorted.sort((a, b) => 
          new Date(b.date!).getTime() - new Date(a.date!).getTime()
        );
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        console.log('No sorting applied');
        return sorted;
    }
  }

  private renderFilteredItems() {
    const filtered = this.getFilteredItems();
    
    // Update the container's data attribute with filtered items
    this.container.dataset.filteredItems = JSON.stringify(filtered);
    
    // Dispatch a custom event that view components can listen to
    this.container.dispatchEvent(new CustomEvent('items-filtered', {
      detail: { items: filtered, filters: this.currentFilters }
    }));

    // Since we're using server-side rendering for views,
    // we'll update the visible items by showing/hiding them
    this.updateVisibleItems(filtered);
  }

  private updateVisibleItems(filtered: CollectionItem[]) {
    const filteredIds = new Set(filtered.map(item => item.id));
    
    // Find all item elements in the current view
    const itemElements = this.container.querySelectorAll('[data-item-id]');
    const itemsMap = new Map<string, Element>();
    
    // Build a map of item ID to element and hide non-matching items
    itemElements.forEach((element) => {
      const itemId = element.getAttribute('data-item-id');
      if (itemId) {
        itemsMap.set(itemId, element);
        if (filteredIds.has(itemId)) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
      }
    });

    // Reorder visible items based on the sorted array
    if (filtered.length > 0) {
      const parent = itemElements[0].parentElement;
      if (parent) {
        // Create a document fragment to minimize reflows
        const fragment = document.createDocumentFragment();
        
        // Append items in the sorted order
        filtered.forEach(item => {
          const element = itemsMap.get(item.id);
          if (element) {
            fragment.appendChild(element);
          }
        });
        
        // Append hidden items at the end (to maintain them in DOM)
        itemElements.forEach(element => {
          if (element.classList.contains('hidden')) {
            fragment.appendChild(element);
          }
        });
        
        // Replace all children at once
        parent.appendChild(fragment);
      }
    }

    // Update count display if exists
    const countElement = document.getElementById('filtered-count');
    if (countElement) {
      countElement.textContent = `${filtered.length} ${this.collection}`;
    }
  }

  private updateURL(reload = false) {
    const url = new URL(window.location.href);
    
    // Clear all existing params
    url.search = '';
    
    // Add current filters
    if (this.currentFilters.search) {
      url.searchParams.set('search', this.currentFilters.search);
    }
    if (this.currentFilters.topics?.length) {
      url.searchParams.set('topics', this.currentFilters.topics.join(','));
    }
    if (this.currentFilters.location) {
      url.searchParams.set('location', this.currentFilters.location);
    }
    if (this.currentFilters.roles?.length) {
      url.searchParams.set('roles', this.currentFilters.roles.join(','));
    }
    if (this.currentFilters.sort && this.currentFilters.sort !== 'date-desc') {
      url.searchParams.set('sort', this.currentFilters.sort);
    }
    // View mode is handled by static routes, not URL params

    // Update URL without reload
    window.history.pushState(this.currentFilters, '', url.toString());
    
    // Dispatch event to update view mode links
    window.dispatchEvent(new Event('popstate'));
  }

  private updateActiveFiltersDisplay() {
    const badgesContainer = document.getElementById('active-filters');
    const mainContainer = document.getElementById('active-filters-container');
    if (!badgesContainer || !mainContainer) return;

    // Clear existing badges
    badgesContainer.replaceChildren();

    // Check if we have any active filters (excluding default sort)
    const hasActiveFilters = 
      this.currentFilters.search ||
      (this.currentFilters.topics && this.currentFilters.topics.length > 0) ||
      this.currentFilters.location ||
      (this.currentFilters.roles && this.currentFilters.roles.length > 0) ||
      (this.currentFilters.sort && this.currentFilters.sort !== 'date-desc' && this.currentFilters.sort !== 'name-asc');

    // Add filter badges
    if (this.currentFilters.search) {
      this.addFilterBadge(badgesContainer, 'search', this.currentFilters.search);
    }

    this.currentFilters.topics?.forEach(topic => {
      this.addFilterBadge(badgesContainer, 'topic', topic);
    });

    if (this.currentFilters.location) {
      this.addFilterBadge(badgesContainer, 'location', this.currentFilters.location);
    }

    this.currentFilters.roles?.forEach(role => {
      this.addFilterBadge(badgesContainer, 'role', role);
    });

    // Show/hide container based on active filters
    if (hasActiveFilters) {
      mainContainer.classList.remove('hidden');
    } else {
      mainContainer.classList.add('hidden');
    }
  }

  private addFilterBadge(container: HTMLElement, type: string, value: string) {
    const badge = document.createElement('div');
    badge.className = 'badge badge-primary gap-1';
    
    const label = document.createElement('span');
    label.textContent = `${type}: ${value}`;
    badge.appendChild(label);
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-ghost btn-xs p-0 h-4 w-4';
    removeBtn.setAttribute('data-remove-filter', type);
    removeBtn.setAttribute('data-filter-value', value);
    removeBtn.setAttribute('aria-label', `Remove ${type} filter: ${value}`);
    
    // Add X icon (using text for simplicity, could be replaced with Icon component)
    removeBtn.textContent = '×';
    
    removeBtn.addEventListener('click', () => {
      this.removeFilter(type, value);
    });
    
    badge.appendChild(removeBtn);
    container.appendChild(badge);
  }

  private removeFilter(type: string, value: string) {
    if (type === 'search') {
      this.currentFilters.search = '';
      const searchInput = document.getElementById('search-input') as HTMLInputElement;
      if (searchInput) searchInput.value = '';
    } else if (type === 'topic' && this.currentFilters.topics) {
      const index = this.currentFilters.topics.indexOf(value);
      if (index > -1) {
        this.currentFilters.topics.splice(index, 1);
      }
    } else if (type === 'location') {
      this.currentFilters.location = '';
    } else if (type === 'role' && this.currentFilters.roles) {
      const index = this.currentFilters.roles.indexOf(value);
      if (index > -1) {
        this.currentFilters.roles.splice(index, 1);
      }
    }

    this.applyFilters();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CollectionFilter());
} else {
  new CollectionFilter();
}