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
  position: string;
  company: string;
  jobLocation: string;
  jobType: string;
  jobTypeOptions?: string[];
  status: string;
  statusOptions?: string[];
};
