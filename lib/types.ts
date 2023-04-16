export type UserInfoProps = {
  id?: string;
  name?: string;
  image?: string;
  token?: string;
  isAdmin?: boolean;
  email?: string;
  location?: string;
};

export type ProjectProps = {
  id?: string;
  url: string;
  projectName: string;
  github: string;
  address: string;
  description: string;
  published: boolean;
  techStack: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type JobProps = {
  id?: string;
  position: string;
  company: string;
  jobLocation: string;
  jobType: string;
  jobTypeOptions?: string[];
  status: string;
  statusOptions?: string[];
  updatedAt?: string;
  page?: number;
  createdAt?: string;
  createdBy?: string;
  search?: string;
  searchStatus?: string;
  searchType?: string;
  sort?: string;
  sortOptions?: string[];
};

export type JobsProps = {
  jobs: JobProps[];
  totalJobs: number;
  numberOfPages: number;
};

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  cover_image: string;
  category: string;
  author: string;
  author_image: string;
};

export type IMessageData = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  token?: string;
  createdAt?: string;
};

export type DefaultStatsProps = {
  pending: number;
  interviewing: number;
  declined: number;
  offer: number;
};

export type MonthlyApplicationsProps = {
  date: string;
  totalPrice: number;
};

export type StatsProps = {
  defaultStats: DefaultStatsProps;
  monthlyApplicationStats: MonthlyApplicationsProps[];
};
