import axios from 'axios';
import isEmpty from 'lodash.isempty';

const BASE_URL = 'https://pixabay.com/';
const API_KEY = '24961892-f769a4f96dd83700267a1d6f9';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export default class PixabayApiService {
  constructor(params = {}) {
    const {
      searchQuery = null,
      type = 'photo',
      orientation = 'horizontal',
      safesearch = true,
      language = 'ru',
      limit = 40,
      page = 1,
    } = params;

    this.data = {};
    this.url = new URL('/api/', BASE_URL);
    this.searchParams = {
      key: API_KEY,
      q: searchQuery,
      image_type: type,
      per_page: limit,
      page,
      orientation,
      safesearch,
      language,
    };
  }

  set searchQuery(newSearchQuery) {
    this.resetPage().searchParams.q = newSearchQuery;
  }

  get searchQuery() {
    return this.searchParams.q;
  }

  get page() {
    return this.searchParams.page;
  }

  incrementPage() {
    this.searchParams.page += 1;
    return this;
  }

  resetPage() {
    this.searchParams.page = 1;
    return this;
  }

  getPagesInfo() {
    return {
      page: this.page,
      count: this.data.count,
      totalHits: this.data.totalHits,
    };
  }

  setData(data) {
    this.data.count = data.hits.length;
    this.data.totalHits = data.totalHits;
  }

  async fetchImages() {
    Object.entries(this.searchParams)
      .forEach(([key, value]) => this.url.searchParams.set(key, value));

    const response = await axiosInstance.get(this.url);

    if (response.data && !isEmpty(response.data)) {
      this.setData(response.data);
    }

    return response;
  }
}
