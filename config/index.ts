const dev = process.env.NODE_ENV !== 'production';

export const NEXT_URL = dev ? 'http://localhost:3000' : 'https://aolausoro.tech';

export const POSTS_PER_PAGE = 6;