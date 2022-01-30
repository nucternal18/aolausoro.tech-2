export type UserInfoProps = {
  id: string;
  name: string;
  image?: string;
  token?: string;
  isAdmin?: boolean;
  email: string;
};

export type ProjectProps = {
  id?: string;
  url: string;
  projectName: string;
  github: string;
  address: string;
  techStack: string[];
};

export type JobProps = {
  _id?: string;
  position: string;
  company: string;
  jobLocation: string;
  jobType: string;
  jobTypeOptions?: string[];
  status: string;
  statusOptions?: string[];
  updatedAt?: string;
  __v?: number;
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
