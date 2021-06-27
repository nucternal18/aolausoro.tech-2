const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://aolausoro.tech';

export const POSTS_PER_PAGE = 6;