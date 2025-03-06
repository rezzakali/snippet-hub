export interface CodeSnippet {
  _id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  isDeleted: boolean;
  tags: Tag[];
  createdBy: string;
  favouriteBy: string[];
  isArchived: boolean;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface CreateSnippet {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string;
}
